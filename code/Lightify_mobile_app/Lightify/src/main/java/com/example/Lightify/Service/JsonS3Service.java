package com.example.Lightify.Service;

import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Service
public class JsonS3Service {

    private final S3Client s3;
    private final S3Presigner presigner;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public JsonS3Service(S3Client s3, S3Presigner presigner) {
        this.s3 = s3;
        this.presigner = presigner;
    }

    /** Uploads raw JSON and returns the object key */
    public String uploadJson(String json) {
        String key = "instructions/" + UUID.randomUUID() + ".json";
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("application/json")
                .build();
        s3.putObject(req, RequestBody.fromString(json));
        return key;
    }

    /** Deletes the given object key from S3. */
    public void deleteJson(String key) {
        s3.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build());
    }

    /** Creates a time‐limited presigned GET URL for that key */
    public String presignUrl(String key) {
        var getReq = software.amazon.awssdk.services.s3.model.GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
        PresignedGetObjectRequest pres = presigner.presignGetObject(
                GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(15))
                        .getObjectRequest(getReq)
                        .build());
        return pres.url().toString();
    }
}
