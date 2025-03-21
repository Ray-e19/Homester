package com.example.Homester;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HomesterApplication {

	public static void main(String[] args) {

		SpringApplication.run(HomesterApplication.class, args);

		System.out.println("Post currently works on 'http://localhost:8080/users'" );
	}


}
