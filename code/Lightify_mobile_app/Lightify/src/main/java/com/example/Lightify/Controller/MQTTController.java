//package com.example.Lightify.Controller;
//
//import com.amazonaws.services.iot.client.AWSIotException;
//import com.example.Lightify.Service.MQTTPubSubService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class MQTTController {
//
//    @Autowired
//    MQTTPubSubService mqttPubSubService;
//
//    @PostMapping("/publish")
//    public String publishTestMessage() throws AWSIotException {
//        mqttPubSubService.publishMessage();
//        return "Msg published Successfully!";
//    }
//}
