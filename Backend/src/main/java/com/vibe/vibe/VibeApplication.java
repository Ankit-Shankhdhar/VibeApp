package com.vibe.vibe;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class VibeApplication {

	@PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }
	public static void main(String[] args) {
		SpringApplication.run(VibeApplication.class, args);
	}

}
