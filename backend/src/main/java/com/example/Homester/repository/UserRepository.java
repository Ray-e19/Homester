package com.example.Homester.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Homester.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);  // Add this method to find users by email
}
