package com.example.Lightify.Service;

import com.amazonaws.services.iot.client.AWSIotException;
import com.example.Lightify.Util.MQTTConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MQTTPubSubService {

    private final MQTTConfig mqttConfig;

    @Autowired
    public MQTTPubSubService(MQTTConfig mqttConfig) {
        this.mqttConfig = mqttConfig;
    }

    public void publishMessage() throws AWSIotException {
        System.out.println("DEBUG: publishMessage() method called in MQTTPubSubService");
        mqttConfig.connectToIot();
    }
}
