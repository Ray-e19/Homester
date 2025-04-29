package com.example.Homester.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Homester.model.House;

public interface HouseRepository extends JpaRepository<House, Long> {
}
