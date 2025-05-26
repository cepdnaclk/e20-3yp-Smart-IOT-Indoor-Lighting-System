package com.example.Lightify.Service;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ExecutionException;


@Service
public class DeviceInstructionsService {

    private final JsonS3Service       jsonS3Service;
    private final AwsIotPubSubService mqttPublisher;
    private final Logger              log = LoggerFactory.getLogger(getClass());

    public DeviceInstructionsService(
            JsonS3Service jsonS3Service,
            AwsIotPubSubService mqttPublisher
    ) {
        this.jsonS3Service = jsonS3Service;
        this.mqttPublisher = mqttPublisher;
    }

    public Map<String,String> sendTransactional(String instructionsJson, String topic)
            throws InterruptedException, ExecutionException {

        String key = null;
        try {
            // 1️⃣ Upload
            key = jsonS3Service.uploadJson(instructionsJson);

            // 2️⃣ Presign
            String url = jsonS3Service.presignUrl(key);

            // 3️⃣ Build wrapper
            ObjectNode wrapper = JsonNodeFactory.instance.objectNode()
                    .put("messageId",   key)
                    .put("downloadUrl", url);

            // 4️⃣ Publish to the provided topic
            mqttPublisher.publish(topic, wrapper.toString());

            // ✅ All succeeded
            return Map.of(
                    "messageId",   key,
                    "downloadUrl", url
            );

        } catch (Exception e) {
            if (key != null) {
                try {
                    jsonS3Service.deleteJson(key);
                    log.info("Rolled back S3 object {}", key);
                } catch (Exception ex) {
                    log.error("Failed to delete S3 object {} during rollback", key, ex);
                }
            }
            throw e;
        }
    }
}
