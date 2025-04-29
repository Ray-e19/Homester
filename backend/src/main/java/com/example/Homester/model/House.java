package com.example.Homester.model;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "houses")
public class House {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int price;
    private int bedrooms;
    private int bathrooms;
    private int sqft;
    private String address;
    private Long userId;
    private Double lat;
    private Double lon;

    @ElementCollection
    @CollectionTable(name = "house_images", joinColumns = @JoinColumn(name = "house_id"))
    @Column(name = "image_url", length = 2000)
    private List<String> images;

    public House() {}

    public House(String title, String description, int price, int bedrooms, int bathrooms, int sqft, String address, Long userId, Double lat, Double lon, List<String> images) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.sqft = sqft;
        this.address = address;
        this.userId = userId;
        this.lat = lat;
        this.lon = lon;
        this.images = images;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public int getBedrooms() { return bedrooms; }
    public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }

    public int getBathrooms() { return bathrooms; }
    public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }

    public int getSqft() { return sqft; }
    public void setSqft(int sqft) { this.sqft = sqft; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLon() { return lon; }
    public void setLon(Double lon) { this.lon = lon; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
}
