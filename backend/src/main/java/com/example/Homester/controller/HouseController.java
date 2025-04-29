package com.example.Homester.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Homester.model.House;
import com.example.Homester.repository.HouseRepository;

@RestController
@RequestMapping("/houses")
public class HouseController {

    @Autowired
    private HouseRepository houseRepository;

    @GetMapping
    public List<House> getAllHouses() {
        return houseRepository.findAll();
    }

    @PostMapping
    public House createHouse(@RequestBody House house) {
        House savedHouse = houseRepository.save(house);
        System.out.println("Saved house: " + savedHouse.getId() + " - " + savedHouse.getTitle());
        return savedHouse;
    }
}
