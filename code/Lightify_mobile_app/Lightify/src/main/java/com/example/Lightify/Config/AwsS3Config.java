package com.example.Lightify.Config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class AwsS3Config {

    private static final Logger logger = LogManager.getLogger(AwsS3Config.class);

    @Value("${aws.region}")
    private String region;

    @Bean
    public S3Client s3Client() {
        logger.info("Initializing S3Client with region: {}", region);

        S3Client s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .httpClientBuilder(UrlConnectionHttpClient.builder())
                .build();

        logger.info("S3Client created successfully.");
        return s3Client;
    }

    @Bean
    public S3Presigner s3Presigner() {
        logger.info("Initializing S3Presigner with region: {}", region);

        S3Presigner s3Presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();

        logger.info("S3Presigner created successfully.");
        return s3Presigner;
    }
}
