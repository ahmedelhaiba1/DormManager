package com.dormmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DormManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DormManagerApplication.class, args);
    }
}
