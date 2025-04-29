package com.example.Homester.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.Homester.model.House;
import com.example.Homester.repository.HouseRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(HouseRepository houseRepository) {
        return args -> {
            if (houseRepository.count() == 0) {
                List<House> houses = Arrays.asList(
                    new House(
                        "Modern Family Home",
                        "Spacious home perfect for families with a large backyard.",
                        450,
                        4,
                        3,
                        2500,
                        "123 Oak St, Los Angeles, CA",
                        null,
                        34.0522,
                        -118.2437,
                        Arrays.asList(
                            // Exterior
                            "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
                            // Interior Sofa
                            "https://www.marthastewart.com/thmb/SqZq9RxrC_bxz6ZGiT7uxATbxCA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pacific-northwest-home-tour-great-room-0820-14d61b428237459b9e996c769ae92dd0.jpg",
                            // Kitchen
                            "https://hips.hearstapps.com/hmg-prod/images/peach-pine-interiors-ph-joseph-bradshaw1-6762de44d651b.jpg"
                        )
                    ),
                    new House(
                        "Coastal Getaway",
                        "Beachfront property with cozy interiors and modern kitchen.",
                        600,
                        3,
                        2,
                        1800,
                        "456 Ocean Blvd, Santa Monica, CA",
                        null,
                        34.0195,
                        -118.4912,
                        Arrays.asList(
                            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                            "https://i.pinimg.com/736x/5f/4a/5d/5f4a5d511b846056ef11426f7f951049.jpg",
                            "https://www.tollbrothers.com/blog/wp-content/uploads/2019/02/8-Overlook-Sandstone_Kitchen-2.jpg"
                        )
                    ),
                    new House(
                        "Luxury Mountain Cabin",
                        "Rustic charm meets modern living in this secluded mountain retreat.",
                        700,
                        5,
                        4,
                        3200,
                        "789 Pine Rd, Big Bear, CA",
                        null,
                        34.2439,
                        -116.9114,
                        Arrays.asList(
                            "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
                            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
                            "https://resources.mhvillage.com/wp-content/uploads/2020/07/Mobile-home-interior-kitchen-1200x900.jpg"
                        )
                    ),
                    new House(
                        "Urban Loft",
                        "Chic loft apartment located in the vibrant downtown district.",
                        350,
                        2,
                        2,
                        1200,
                        "321 Market St, San Diego, CA",
                        null,
                        32.7157,
                        -117.1611,
                        Arrays.asList(
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                            "https://images.unsplash.com/photo-1554995207-c18c203602cb",
                            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
                        )
                    )
                );

                houseRepository.saveAll(houses);
                System.out.println("✅ Seeded 4 high-quality sample houses with real images!");
            }
        };
    }
}
