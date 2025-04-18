package com.example.Homester.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "House")

public class House {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;
    private int price;
    private int bedrooms;
    private int bathrooms;

    public House() {}

    public House(String address, int price, int bedrooms, int bathrooms) 
    {
        this.address = address;
        this.price = price;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
    }

    public Long getId()
    {
        return id;
    }

    public void setId(Long id) 
    {
        this.id = id;
    }

    public String getAddress() 
    {
        return address;
    }

    public void setAddress(String address)
     {
        this.address = address;
    }

    public int getPrice() 
    {
        return price;
    }

    public void setPrice(int price) 
    {
        this.price = price;
    }

    public int getBedrooms() 
    {
        return bedrooms;
    }

    public void setBedrooms(int bedrooms) 
    {
        this.bedrooms = bedrooms;
    }

    public int getBathrooms() 
    {
        return bathrooms;
    }

    public void setBathrooms(int bathrooms) 
    {
        this.bathrooms = bathrooms;
    }

}

