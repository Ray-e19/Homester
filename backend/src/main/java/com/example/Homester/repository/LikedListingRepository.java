package com.example.Homester.repository;

import com.example.Homester.model.LikedListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikedListingRepository extends JpaRepository<LikedListing, Long> {
    List<LikedListing> findByUserId(Long userId);
    Optional<LikedListing> findByUserIdAndHouseId(Long userId, Long houseId);
}
