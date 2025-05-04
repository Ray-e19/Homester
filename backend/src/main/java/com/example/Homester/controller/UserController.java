package com.example.Homester.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Homester.model.User;
import com.example.Homester.repository.UserRepository;

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
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null); // prevent sending it back to frontend

        System.out.println("Saved user: " + savedUser.getId() + " - " + savedUser.getUsername());
        return savedUser;
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
    System.out.println("LOGIN HIT");

    String email = loginData.get("email");
    String password = loginData.get("password");

    System.out.println("Email received: " + email);
    System.out.println("Password received: " + password);

User user = userRepository.findByEmail(email);

if (user == null) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
}

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    System.out.println("Stored hash: " + user.getPassword());

    boolean match = encoder.matches(password, user.getPassword());
    System.out.println("Password match? " + match);

    if (!match) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
    }

    user.setPassword(null);
    System.out.println("LOGIN SUCCESS for user: " + user.getUsername());
    return ResponseEntity.ok(user);
}

}
