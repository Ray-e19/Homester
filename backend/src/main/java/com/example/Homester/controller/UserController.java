package com.example.Homester.controller;

import com.example.Homester.model.User;
import com.example.Homester.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        System.out.println("Saved user: " + savedUser.getId() + " - " + savedUser.getUsername()+ " - " + savedUser.getEmail()); // Logging added
        return savedUser;
    }
}
