package com.example.Homester.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Homester.model.LikedListing;
import com.example.Homester.repository.LikedListingRepository;

@RestController
@RequestMapping("/likes")
public class LikedListingController {

    @Autowired
    private LikedListingRepository likedListingRepository;

    @GetMapping("/{userId}")
    public List<LikedListing> getUserLikes(@PathVariable Long userId) {
        return likedListingRepository.findByUserId(userId);
    }

    @PostMapping
    public LikedListing like(@RequestBody Map<String, Long> data) {
        Long userId = data.get("userId");
        Long houseId = data.get("houseId");

        Optional<LikedListing> existing = likedListingRepository.findByUserIdAndHouseId(userId, houseId);
        if (existing.isPresent()) {
            // Unlike
            likedListingRepository.delete(existing.get());
            return null;
        }

        LikedListing newLike = new LikedListing(userId, houseId);
        return likedListingRepository.save(newLike);
    }
}
