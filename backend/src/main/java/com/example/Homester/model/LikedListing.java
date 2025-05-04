package com.example.Homester.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "liked_listings")
public class LikedListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long houseId;
    private LocalDateTime likedAt;

    @PrePersist
    protected void onCreate() {
        likedAt = LocalDateTime.now();
    }

    public LikedListing() {}

    public LikedListing(Long userId, Long houseId) {
        this.userId = userId;
        this.houseId = houseId;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getHouseId() { return houseId; }
    public LocalDateTime getLikedAt() { return likedAt; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setHouseId(Long houseId) { this.houseId = houseId; }
    public void setLikedAt(LocalDateTime likedAt) { this.likedAt = likedAt; }
}
