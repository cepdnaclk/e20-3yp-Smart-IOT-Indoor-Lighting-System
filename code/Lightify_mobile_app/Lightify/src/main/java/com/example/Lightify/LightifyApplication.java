package com.example.Lightify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LightifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(LightifyApplication.class, args);
	}

}
