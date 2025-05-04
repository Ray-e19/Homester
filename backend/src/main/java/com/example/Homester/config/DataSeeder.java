package com.example.Homester.config;

import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.Homester.model.House;
import com.example.Homester.model.Message;
import com.example.Homester.model.User;
import com.example.Homester.repository.HouseRepository;
import com.example.Homester.repository.MessageRepository;
import com.example.Homester.repository.UserRepository;

@Configuration
public class DataSeeder {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CommandLineRunner initData(UserRepository userRepo, HouseRepository houseRepo, MessageRepository messageRepo, PasswordEncoder encoder) {
        return args -> {
            // Clear existing data
            messageRepo.deleteAll();
            houseRepo.deleteAll();
            userRepo.deleteAll();

            // Seed users
            User demo = userRepo.save(new User("demo", "demo@example.com", encoder.encode("password"), "Demo_User1"));
            User user2 = userRepo.save(new User("alice", "alice@example.com", encoder.encode("alice123"), "ROLE_USER"));
            User user3 = userRepo.save(new User("bob", "bob@example.com", encoder.encode("bob123"), "ROLE_USER"));
            User user4 = userRepo.save(new User("carol", "carol@example.com", encoder.encode("carol123"), "ROLE_USER"));

            // Seed houses
            House h1 = houseRepo.save(new House(
                "123 Oak St, Los Angeles, CA",
                "Beautiful family home located in Los Angeles, CA.",
                1450000,
                4,
                3,
                2500,
                "123 Oak St, Los Angeles, CA",
                demo.getId(),
                34.0522,
                -118.2437,
                Arrays.asList(
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
                    "https://www.marthastewart.com/thmb/SqZq9RxrC_bxz6ZGiT7uxATbxCA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pacific-northwest-home-tour-great-room-0820-14d61b428237459b9e996c769ae92dd0.jpg",
                    "https://hips.hearstapps.com/hmg-prod/images/peach-pine-interiors-ph-joseph-bradshaw1-6762de44d651b.jpg"
                )
            ));
            House h2 = houseRepo.save(new House(
                "456 Ocean Blvd, Santa Monica, CA",
                "Coastal property just steps from the beach in Santa Monica, CA.",
                1600000,
                3,
                2,
                1800,
                "456 Ocean Blvd, Santa Monica, CA",
                user2.getId(),
                34.0195,
                -118.4912,
                Arrays.asList(
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                    "https://i.pinimg.com/736x/5f/4a/5d/5f4a5d511b846056ef11426f7f951049.jpg",
                    "https://www.tollbrothers.com/blog/wp-content/uploads/2019/02/8-Overlook-Sandstone_Kitchen-2.jpg"
                )
            ));
            House h3 = houseRepo.save(new House(
                "789 Pine Rd, Big Bear, CA",
                "Secluded mountain cabin retreat located in Big Bear, CA.",
                1700000,
                5,
                4,
                3200,
                "789 Pine Rd, Big Bear, CA",
                user3.getId(),
                34.2439,
                -116.9114,
                Arrays.asList(
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
                    "https://resources.mhvillage.com/wp-content/uploads/2020/07/Mobile-home-interior-kitchen-1200x900.jpg"
                )
            ));
            House h4 = houseRepo.save(new House(
                "321 Market St, San Diego, CA",
                "Modern loft in the heart of downtown San Diego, CA.",
                1350000,
                2,
                2,
                1200,
                "321 Market St, San Diego, CA",
                user4.getId(),
                32.7157,
                -117.1611,
                Arrays.asList(
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                    "https://images.unsplash.com/photo-1554995207-c18c203602cb",
                    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
                )
            ));

            // Seed messages sent *to* demo’s house
            messageRepo.save(new Message(user2.getId(), h1.getId(), "contact", "Is the backyard fenced?", null, null));
            messageRepo.save(new Message(user3.getId(), h1.getId(), "contact", "Would you consider seller financing?", null, null));
            messageRepo.save(new Message(user4.getId(), h1.getId(), "tour", null, "2025-05-05", "09:00"));

            System.out.println("✅ Seeded demo user, 4 listings, and 3 messages.");
        };
    }
}
