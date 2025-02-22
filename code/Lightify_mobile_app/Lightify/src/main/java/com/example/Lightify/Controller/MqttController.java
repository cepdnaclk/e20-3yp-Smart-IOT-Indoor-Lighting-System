package com.example.Lightify.Controller;

import com.example.Lightify.Service.AwsIotPubSubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/mqtt")
public class MqttController {

    private final AwsIotPubSubService pubSubService;

    @Autowired
    public MqttController(AwsIotPubSubService pubSubService) {
        this.pubSubService = pubSubService;
    }

//    @PostMapping("/publish")
//    public ResponseEntity<String> publishMessage(@RequestParam String topic,
//                                                 @RequestParam String message) throws Exception {
//        pubSubService.publish(topic, message);
//        return ResponseEntity.ok("Message published");
//    }

    @PostMapping("/publish")
    public ResponseEntity<String> publishMessage(@RequestBody Map<String, Object> body) throws ExecutionException, InterruptedException {
        // Suppose the JSON looks like {"topic": "myTopic", "message": "some data"}
        String topic = (String) body.get("topic");
        String message = (String) body.get("message");
        pubSubService.publish(topic, message);
        return ResponseEntity.ok("Message published");
    }


    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribeTopic(@RequestParam String topic) throws Exception {
        pubSubService.subscribe(topic);
        return ResponseEntity.ok("Subscribed to topic: " + topic);
    }
}
