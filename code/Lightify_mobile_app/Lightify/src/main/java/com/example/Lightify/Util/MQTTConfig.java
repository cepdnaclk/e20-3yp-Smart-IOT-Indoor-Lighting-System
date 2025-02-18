package com.example.Lightify.Util;
import com.amazonaws.services.iot.client.AWSIotMqttClient;
import com.amazonaws.services.iot.client.AWSIotException;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MQTTConfig {

    private static final Dotenv dotenv = Dotenv.load();
    private final String clientEndpoint = dotenv.get("AWS_IOT_ENDPOINT");
    private final String clientId = dotenv.get("AWS_IOT_CLIENT_ID");
    private final String awsAccessKeyId = dotenv.get("AWS_ACCESS_KEY");
    private final String awsSecretAccessKey = dotenv.get("AWS_SECRET_KEY");

    private AWSIotMqttClient client;

    @Bean
    public AWSIotMqttClient mqttClient() {
        if (client == null) {
            System.out.println("DEBUG: Creating AWS IoT MQTT Client...");
            client = new AWSIotMqttClient(clientEndpoint, clientId, awsAccessKeyId, awsSecretAccessKey);
        }
        return client;
    }

    public void connectToIot() {
        System.out.println("DEBUG: connectToIot() method called");

        try {
            if (client == null) {
                System.out.println("DEBUG: Initializing MQTT Client...");
                client = mqttClient();
            }

            System.out.println("DEBUG: Attempting to connect to AWS IoT...");
            client.connect();
            System.out.println("Successfully connected to AWS IoT!");
        } catch (AWSIotException e) {
            e.printStackTrace();
            System.err.println("Failed to connect to AWS IoT");
        }
    }
}
