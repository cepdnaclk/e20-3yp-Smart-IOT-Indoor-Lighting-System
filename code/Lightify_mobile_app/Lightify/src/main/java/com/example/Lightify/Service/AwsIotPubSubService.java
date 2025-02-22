//package com.example.Lightify.Service;
//
//import java.nio.charset.StandardCharsets;
//import java.util.concurrent.CompletableFuture;
//import java.util.concurrent.ExecutionException;
//
//import jakarta.annotation.PostConstruct;
//import jakarta.annotation.PreDestroy;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import software.amazon.awssdk.crt.CrtResource;
//import software.amazon.awssdk.crt.http.HttpProxyOptions;
//import software.amazon.awssdk.crt.mqtt.MqttClientConnection;
//import software.amazon.awssdk.crt.mqtt.MqttClientConnectionEvents;
//import software.amazon.awssdk.crt.mqtt.MqttMessage;
//import software.amazon.awssdk.crt.mqtt.QualityOfService;
//import software.amazon.awssdk.iot.AwsIotMqttConnectionBuilder;
//
//@Service
//public class AwsIotPubSubService {
//
//    @Value("${aws.iot.clientId}")
//    private String clientId;
//
//    @Value("${aws.iot.endpoint}")
//    private String endpoint;
//
//    @Value("${aws.iot.port}")
//    private int port;
//
//    @Value("${aws.iot.certificate.path}")
//    private String certificatePath;
//
//    @Value("${aws.iot.privateKey.path}")
//    private String privateKeyPath;
//
//    @Value("${aws.iot.certificateAuthority.path:}")
//    private String certificateAuthorityPath;
//
//    @Value("${aws.iot.cleanSession}")
//    private boolean cleanSession;
//
//    @Value("${aws.iot.protocolTimeoutMs}")
//    private int protocolTimeoutMs;
//
//    @Value("${aws.iot.proxy.host:}")
//    private String proxyHost;
//
//    @Value("${aws.iot.proxy.port:0}")
//    private int proxyPort;
//
//    private MqttClientConnection connection;
//
//    @PostConstruct
//    public void init() throws Exception {
//        // Build the connection using mutual TLS authentication.
//        AwsIotMqttConnectionBuilder builder =
//                AwsIotMqttConnectionBuilder.newMtlsBuilderFromPath(certificatePath, privateKeyPath);
//        builder.withClientId(clientId)
//                .withEndpoint(endpoint)
//                .withPort(port)
//                .withCleanSession(cleanSession)
//                .withProtocolOperationTimeoutMs(protocolTimeoutMs);
//
//        // If a certificate authority path is provided, set it.
//        if (certificateAuthorityPath != null && !certificateAuthorityPath.isEmpty()) {
//            builder.withCertificateAuthorityFromPath(null, certificateAuthorityPath);
//        }
//
//        // If proxy settings are provided, set them.
//        if (proxyHost != null && !proxyHost.isEmpty() && proxyPort > 0) {
//            HttpProxyOptions proxyOptions = new HttpProxyOptions();
//            proxyOptions.setHost(proxyHost);
//            proxyOptions.setPort(proxyPort);
//            builder.withHttpProxyOptions(proxyOptions);
//        }
//
//        // Set up connection event callbacks.
//        builder.withConnectionEventCallbacks(new MqttClientConnectionEvents() {
//            @Override
//            public void onConnectionInterrupted(int errorCode) {
//                if (errorCode != 0) {
//                    System.out.println("Connection interrupted: " + errorCode);
//                }
//            }
//
//            @Override
//            public void onConnectionResumed(boolean sessionPresent) {
//                System.out.println("Connection resumed: " + (sessionPresent ? "existing session" : "clean session"));
//            }
//        });
//
//        // Build and immediately close the builder.
//        connection = builder.build();
//        builder.close();
//
//        // Connect the MQTT client.
//        CompletableFuture<Boolean> connectedFuture = connection.connect();
//        boolean sessionPresent = connectedFuture.get();
//        System.out.println("Connected to " + (!sessionPresent ? "new" : "existing") + " session!");
//    }
//
//    /**
//     * Subscribes to a given topic. The provided callback prints incoming messages.
//     */
//    public void subscribe(String topic) throws InterruptedException, ExecutionException {
//        CompletableFuture<Integer> subscribed = connection.subscribe(topic, QualityOfService.AT_LEAST_ONCE, (MqttMessage message) -> {
//            // Retrieve payload from the message.
//            byte[] payloadBytes = message.getPayload();
//            String payload = new String(payloadBytes, StandardCharsets.UTF_8);
//            System.out.println("MESSAGE: " + payload);
//        });
//        subscribed.get();
//        System.out.println("Subscribed to topic: " + topic);
//    }
//
//    /**
//     * Publishes the given payload to the specified topic.
//     */
//    public void publish(String topic, String payload) throws InterruptedException, ExecutionException {
//        byte[] payloadBytes = payload.getBytes(StandardCharsets.UTF_8);
//        // Publish with AT_LEAST_ONCE QoS and a retain flag of false.
//        MqttMessage message = new MqttMessage(topic, payloadBytes, QualityOfService.AT_LEAST_ONCE, false);
//        CompletableFuture<Integer> published = connection.publish(message);
//        published.get();
//        System.out.println("Published message to topic " + topic + ": " + payload);
//    }
//
//    @PreDestroy
//    public void cleanup() throws Exception {
//        if (connection != null) {
//            CompletableFuture<Void> disconnected = connection.disconnect();
//            disconnected.get();
//            connection.close();
//            CrtResource.waitForNoResources();
//            System.out.println("Disconnected and closed connection.");
//        }
//    }
//}


package com.example.Lightify.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
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

    @PostConstruct
    public void init() throws IOException, ExecutionException, InterruptedException {
        /*
         * 1) Convert classpath resources to actual file paths
         *    so that the native SDK can read them.
         */
        Resource certResource = new ClassPathResource(certificatePath);
        Resource keyResource  = new ClassPathResource(privateKeyPath);

        String certAbsolutePath = certResource.getFile().getAbsolutePath();
        String keyAbsolutePath  = keyResource.getFile().getAbsolutePath();

        /*
         * 2) Build the connection using mutual TLS.
         */
        AwsIotMqttConnectionBuilder builder =
                AwsIotMqttConnectionBuilder.newMtlsBuilderFromPath(certAbsolutePath, keyAbsolutePath);

        builder.withClientId(clientId)
                .withEndpoint(endpoint)
                .withPort(port)
                .withCleanSession(cleanSession)
                .withProtocolOperationTimeoutMs(protocolTimeoutMs);

        // If a certificate authority path is provided, load it similarly.
        if (certificateAuthorityPath != null && !certificateAuthorityPath.isEmpty()) {
            Resource caResource = new ClassPathResource(certificateAuthorityPath);
            String caAbsolutePath = caResource.getFile().getAbsolutePath();
            builder.withCertificateAuthorityFromPath(null, caAbsolutePath);
        }

        // If proxy settings are provided, configure them.
        if (proxyHost != null && !proxyHost.isEmpty() && proxyPort > 0) {
            HttpProxyOptions proxyOptions = new HttpProxyOptions();
            proxyOptions.setHost(proxyHost);
            proxyOptions.setPort(proxyPort);
            builder.withHttpProxyOptions(proxyOptions);
        }

        // Set up connection event callbacks
        builder.withConnectionEventCallbacks(new MqttClientConnectionEvents() {
            @Override
            public void onConnectionInterrupted(int errorCode) {
                if (errorCode != 0) {
                    System.out.println("Connection interrupted: " + errorCode);
                }
            }

            @Override
            public void onConnectionResumed(boolean sessionPresent) {
                System.out.println("Connection resumed: "
                        + (sessionPresent ? "existing session" : "clean session"));
            }
        });

        // Build and close the builder
        connection = builder.build();
        builder.close();

        // Connect the MQTT client
        CompletableFuture<Boolean> connectedFuture = connection.connect();
        boolean sessionPresent = connectedFuture.get();
        System.out.println("Connected to " + (!sessionPresent ? "new" : "existing") + " session!");
    }

    /**
     * Subscribes to a given topic. The provided callback prints incoming messages.
     */
    public void subscribe(String topic) throws InterruptedException, ExecutionException {
        CompletableFuture<Integer> subscribed = connection.subscribe(
                topic,
                QualityOfService.AT_LEAST_ONCE,
                (MqttMessage message) -> {
                    byte[] payloadBytes = message.getPayload();
                    String payload = new String(payloadBytes, StandardCharsets.UTF_8);
                    System.out.println("MESSAGE: " + payload);
                }
        );
        subscribed.get();
        System.out.println("Subscribed to topic: " + topic);
    }

    /**
     * Publishes the given payload to the specified topic.
     */
    public void publish(String topic, String payload) throws InterruptedException, ExecutionException {
        byte[] payloadBytes = payload.getBytes(StandardCharsets.UTF_8);
        MqttMessage message = new MqttMessage(topic, payloadBytes, QualityOfService.AT_LEAST_ONCE, false);

        CompletableFuture<Integer> published = connection.publish(message);
        published.get();
        System.out.println("Published message to topic " + topic + ": " + payload);
    }

    @PreDestroy
    public void cleanup() throws ExecutionException, InterruptedException {
        if (connection != null) {
            CompletableFuture<Void> disconnected = connection.disconnect();
            disconnected.get();
            connection.close();
            CrtResource.waitForNoResources();
            System.out.println("Disconnected and closed connection.");
        }
    }
}
