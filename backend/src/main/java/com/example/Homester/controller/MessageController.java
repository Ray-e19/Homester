package com.example.Homester.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Homester.model.House;
import com.example.Homester.model.Message;
import com.example.Homester.repository.HouseRepository;
import com.example.Homester.repository.MessageRepository;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private HouseRepository houseRepository;

    @PostMapping
    public Message saveMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }

    @GetMapping("/{userId}")
    public List<Message> getUserMessages(@PathVariable Long userId) {
        return messageRepository.findMessagesRelatedToUser(userId);
    }

    // Listing update endpoint
    @PutMapping("/houses/{id}")
    public ResponseEntity<House> updateHouse(@PathVariable Long id, @RequestBody House updatedHouse) {
        return houseRepository.findById(id)
            .map(existing -> {
                existing.setTitle(updatedHouse.getTitle());
                existing.setDescription(updatedHouse.getDescription());
                existing.setPrice(updatedHouse.getPrice());
                existing.setBedrooms(updatedHouse.getBedrooms());
                existing.setBathrooms(updatedHouse.getBathrooms());
                existing.setSqft(updatedHouse.getSqft());
                existing.setAddress(updatedHouse.getAddress());
                existing.setLat(updatedHouse.getLat());
                existing.setLon(updatedHouse.getLon());
                existing.setImages(updatedHouse.getImages());
                return ResponseEntity.ok(houseRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }
} 
