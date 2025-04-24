package com.example.Homester.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Homester.model.House;
import com.example.Homester.repository.HouseRepository;

@RestController
@RequestMapping("/House")
public class HouseController {
@Autowired
    private HouseRepository houseRepo;

    @PostMapping
    public ResponseEntity<House> addHouse(@RequestBody House house) {
        House savedHouse = houseRepo.save(house);
        return ResponseEntity.ok(savedHouse);
    }
}
