package com.example.Lightify.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import com.example.Lightify.Entity.ReceivedMessage;
import com.example.Lightify.Entity.Topic;
import com.example.Lightify.Repository.ReceivedMessageRepository;
import com.example.Lightify.Repository.TopicRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.crt.CrtResource;
import software.amazon.awssdk.crt.http.HttpProxyOptions;
import software.amazon.awssdk.crt.mqtt.MqttClientConnection;
import software.amazon.awssdk.crt.mqtt.MqttClientConnectionEvents;
import software.amazon.awssdk.crt.mqtt.MqttMessage;
import software.amazon.awssdk.crt.mqtt.QualityOfService;
import software.amazon.awssdk.iot.AwsIotMqttConnectionBuilder;

@Service
public class AwsIotPubSubService {

    private static final Logger logger = LogManager.getLogger(AwsIotPubSubService.class);

    @Value("${aws.iot.clientId}")
    private String clientId;

    @Value("${aws.iot.endpoint}")
    private String endpoint;

    @Value("${aws.iot.port}")
    private int port;

    @Value("${aws.iot.certificate.path}")
    private String certificatePath; // e.g., "Cert/your-certificate.pem.crt"

    @Value("${aws.iot.privateKey.path}")
    private String privateKeyPath;  // e.g., "Cert/your-private.pem.key"

    @Value("${aws.iot.certificateAuthority.path:}")
    private String certificateAuthorityPath; // e.g., "Cert/AmazonRootCA1.pem"

    @Value("${aws.iot.cleanSession}")
    private boolean cleanSession;

    @Value("${aws.iot.protocolTimeoutMs}")
    private int protocolTimeoutMs;

    @Value("${aws.iot.proxy.host:}")
    private String proxyHost;

    @Value("${aws.iot.proxy.port:0}")
    private int proxyPort;

    private MqttClientConnection connection;

    private final ReceivedMessageRepository messageRepository;
    private final TopicRepository topicRepository;

    public AwsIotPubSubService(ReceivedMessageRepository messageRepository, TopicRepository topicRepository) {
        this.messageRepository = messageRepository;
        this.topicRepository = topicRepository;
    }

    @PostConstruct
    public void init() throws IOException, ExecutionException, InterruptedException {
        // Convert classpath resources to file paths so that the native SDK can read them.
        Resource certResource = new ClassPathResource(certificatePath);
        Resource keyResource  = new ClassPathResource(privateKeyPath);
        String certAbsolutePath = certResource.getFile().getAbsolutePath();
        String keyAbsolutePath  = keyResource.getFile().getAbsolutePath();

        // Build the connection using mutual TLS.
        AwsIotMqttConnectionBuilder builder =
                AwsIotMqttConnectionBuilder.newMtlsBuilderFromPath(certAbsolutePath, keyAbsolutePath);

        builder.withClientId(clientId)
                .withEndpoint(endpoint)
                .withPort(port)
                .withCleanSession(cleanSession)
                .withProtocolOperationTimeoutMs(protocolTimeoutMs);

        // Optionally load a certificate authority if provided.
        if (certificateAuthorityPath != null && !certificateAuthorityPath.isEmpty()) {
            Resource caResource = new ClassPathResource(certificateAuthorityPath);
            String caAbsolutePath = caResource.getFile().getAbsolutePath();
            builder.withCertificateAuthorityFromPath(null, caAbsolutePath);
        }

        // Optionally configure proxy settings.
        if (proxyHost != null && !proxyHost.isEmpty() && proxyPort > 0) {
            HttpProxyOptions proxyOptions = new HttpProxyOptions();
            proxyOptions.setHost(proxyHost);
            proxyOptions.setPort(proxyPort);
            builder.withHttpProxyOptions(proxyOptions);
        }

        // Set up connection event callbacks.
        builder.withConnectionEventCallbacks(new MqttClientConnectionEvents() {
            @Override
            public void onConnectionInterrupted(int errorCode) {
                if (errorCode != 0) {
                    logger.error("Connection interrupted: {}", errorCode);
                }
            }
            @Override
            public void onConnectionResumed(boolean sessionPresent) {
                logger.info("Connection resumed: {}", (sessionPresent ? "existing session" : "clean session"));
            }
        });

        // Build the connection and close the builder.
        connection = builder.build();
        builder.close();

        // Connect to AWS IoT Core.
        CompletableFuture<Boolean> connectedFuture = connection.connect();
        boolean sessionPresent = connectedFuture.get();
        logger.info("Connected to {} session!", (!sessionPresent ? "new" : "existing"));

        // On initialization, fetch all topics from the database and subscribe to each.
        List<Topic> topics = topicRepository.findAll();
        for (Topic t : topics) {
            String topicString = t.getTopicString();
                logger.info("fetched topics: {}", topicString);
            try {
                subscribe(topicString);
                logger.info("Automatically subscribed to topic: {}", topicString);
            } catch (Exception e) {
                logger.error("Error subscribing to topic {}: {}", topicString, e.getMessage());
            }
        }
    }

    /**
     * Subscribes to the given topic. When a message is received, it is converted from a byte array
     * into a String, and then stored in MongoDB along with the topic and a timestamp.
     * It also ensures that only the 10 most recent messages for each topic are kept.
     */
    public void subscribe(String topic) throws InterruptedException, ExecutionException {
        CompletableFuture<Integer> subscribed = connection.subscribe(
                topic,
                QualityOfService.AT_LEAST_ONCE,
                (MqttMessage message) -> {
                    byte[] payloadBytes = message.getPayload();
                    String payload = new String(payloadBytes, StandardCharsets.UTF_8);
                    logger.info("Received message on topic {}: {}", topic, payload);
                    // Create a new ReceivedMessage entity.
                    ReceivedMessage receivedMessage = new ReceivedMessage();
                    receivedMessage.setTopic(topic);
                    receivedMessage.setPayload(payload);
                    receivedMessage.setTimestamp(new Date());
                    messageRepository.save(receivedMessage);

                    // After saving, limit stored messages for this topic to the 10 most recent.
                    List<ReceivedMessage> messages = messageRepository.findByTopicOrderByTimestampAsc(topic);
                    if (messages.size() > 10) {
                        int toRemove = messages.size() - 10;
                        for (int i = 0; i < toRemove; i++) {
                            ReceivedMessage rm = messages.get(i);
                            messageRepository.delete(rm);
                            logger.info("Deleted old message with id: {}", rm.getId());
                        }
                    }
                }
        );
        subscribed.get();
        logger.info("Subscribed to topic: {}", topic);
    }

    /**
     * Publishes the given payload to the specified topic.
     */
    public void publish(String topic, String payload) throws InterruptedException, ExecutionException {
        byte[] payloadBytes = payload.getBytes(StandardCharsets.UTF_8);
        MqttMessage message = new MqttMessage(topic, payloadBytes, QualityOfService.AT_LEAST_ONCE, false);
        CompletableFuture<Integer> published = connection.publish(message);
        published.get();
        logger.info("Published message to topic {}: {}", topic, payload);
    }

    /**
     * Retrieves the latest received message for the given topic from the MongoDB database.
     */
    public String getLatestMessage(String topic) {
        return messageRepository.findTopByTopicOrderByTimestampDesc(topic)
                .map(ReceivedMessage::getPayload)
                .orElse("No message received yet for topic: " + topic);
    }

    @PreDestroy
    public void cleanup() throws ExecutionException, InterruptedException {
        if (connection != null) {
            CompletableFuture<Void> disconnected = connection.disconnect();
            disconnected.get();
            connection.close();
            CrtResource.waitForNoResources();
            logger.info("Disconnected and closed connection.");
        }
    }
}
