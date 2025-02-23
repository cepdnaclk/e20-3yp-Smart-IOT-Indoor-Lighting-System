//package com.example.Lightify.Entity;
//
//import lombok.Data;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//import java.util.Date;
//
//@Data
//@Document(collection = "receivedMessages")
//public class ReceivedMessage {
//    @Id
//    private String id;
//    private String payload;
//    private Date timestamp;
//}

package com.example.Lightify.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "receivedMessages")
public class ReceivedMessage {
    @Id
    private String id;
    private String topic;
    private String payload;
    private Date timestamp;

}
