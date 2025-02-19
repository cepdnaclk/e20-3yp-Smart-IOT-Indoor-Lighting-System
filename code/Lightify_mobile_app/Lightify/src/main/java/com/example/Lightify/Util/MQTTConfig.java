/// /package com.example.Lightify.Util;
/// /
/// /import com.amazonaws.services.iot.client.AWSIotMqttClient;
/// /import io.github.cdimascio.dotenv.Dotenv;
/// /import org.springframework.context.annotation.Bean;
/// /import org.springframework.context.annotation.Configuration;
/// /import java.io.File;
/// /
/// /@Configuration
/// /public class MQTTConfig {
/// /
/// /    private static final Dotenv dotenv = Dotenv.load();
/// /    private final String clientEndpoint = dotenv.get("AWS_IOT_ENDPOINT");
/// /    private final String clientId = dotenv.get("AWS_IOT_CLIENT_ID");
/// /    private final String certificateFile = dotenv.get("AWS_IOT_CERTIFICATE_FILE");
/// /    private final String privateKeyFile = dotenv.get("AWS_IOT_PRIVATE_KEY_FILE");
/// /    private final String rootCAFile = dotenv.get("AWS_IOT_ROOT_CA_FILE");
/// /
/// /    private AWSIotMqttClient client;
/// /
/// /    @Bean
/// /    public AWSIotMqttClient mqttClient() {
/// /        System.out.println("DEBUG: Initializing AWS IoT MQTT Client...");
/// /
/// /        // 🛑 Check if environment variables are missing
/// /        if (clientEndpoint == null || clientId == null || certificateFile == null || privateKeyFile == null || rootCAFile == null) {
/// /            throw new RuntimeException("Missing AWS IoT environment variables. Please check the .env file.");
/// /        }
/// /
/// /        // 🛑 Check if files exist
/// /        File certFile = new File(certificateFile);
/// /        File keyFile = new File(privateKeyFile);
/// /        File caFile = new File(rootCAFile);
/// /
/// /        if (!certFile.exists() || !keyFile.exists() || !caFile.exists()) {
/// /            throw new RuntimeException("AWS IoT Certificate, Private Key, or Root CA file is missing at the specified path.");
/// /        }
/// /
/// /        // ✅ Use certificate authentication
/// /        client = new AWSIotMqttClient(clientEndpoint, clientId, certificateFile, privateKeyFile, rootCAFile);
/// /        return client;
/// /    }
/// /
/// /    public void connectToIot() {
/// /        System.out.println("DEBUG: connectToIot() method called");
/// /
/// /        try {
/// /            if (client == null) {
/// /                System.out.println("DEBUG: Initializing MQTT Client...");
/// /                client = mqttClient();
/// /            }
/// /
/// /            System.out.println("DEBUG: Attempting to connect to AWS IoT...");
/// /            client.connect();
/// /            System.out.println("Successfully connected to AWS IoT!");
/// /        } catch (Exception e) {
/// /            e.printStackTrace();
/// /            System.err.println("Failed to connect to AWS IoT");
/// /        }
/// /    }
/// /}
//
//
//package com.example.Lightify.Util;
//
//import com.amazonaws.services.iot.client.AWSIotMqttClient;
//import io.github.cdimascio.dotenv.Dotenv;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import java.io.File;
//
//@Configuration
//public class MQTTConfig {
//
//    private static final Dotenv dotenv = Dotenv.load();
//    private final String clientEndpoint = dotenv.get("AWS_IOT_ENDPOINT");
//    private final String clientId = dotenv.get("AWS_IOT_CLIENT_ID");
//    private final String certificateFile = dotenv.get("AWS_IOT_CERTIFICATE_FILE");
//    private final String privateKeyFile = dotenv.get("AWS_IOT_PRIVATE_KEY_FILE");
//    private final String rootCAFile = dotenv.get("AWS_IOT_ROOT_CA_FILE");
//
//    private AWSIotMqttClient client;
//
//    @Bean
//    public AWSIotMqttClient mqttClient() {
//        System.out.println("DEBUG: Initializing AWS IoT MQTT Client...");
//
//        // 🛑 Check if environment variables are missing
//        if (clientEndpoint == null || clientId == null || certificateFile == null || privateKeyFile == null || rootCAFile == null) {
//            throw new RuntimeException("Missing AWS IoT environment variables. Please check the .env file.");
//        }
//
//        // 🛑 Check if files exist
//        File certFile = new File(certificateFile);
//        File keyFile = new File(privateKeyFile);
//        File caFile = new File(rootCAFile);
//
//        if (!certFile.exists() || !keyFile.exists() || !caFile.exists()) {
//            throw new RuntimeException("AWS IoT Certificate, Private Key, or Root CA file is missing at the specified path.");
//        }
//
//        // ✅ Use certificate authentication
//        client = new AWSIotMqttClient(clientEndpoint, clientId, certificateFile, privateKeyFile, rootCAFile);
//        return client;
//    }
//
//    public void connectToIot() {
//        System.out.println("DEBUG: connectToIot() method called");
//
//        try {
//            if (client == null) {
//                System.out.println("DEBUG: Initializing MQTT Client...");
//                client = mqttClient();
//            }
//
//            System.out.println("DEBUG: Attempting to connect to AWS IoT...");
//            client.connect();
//            System.out.println("Successfully connected to AWS IoT!");
//        } catch (Exception e) {
//            e.printStackTrace();
//            System.err.println("Failed to connect to AWS IoT");
//        }
//    }
//}
