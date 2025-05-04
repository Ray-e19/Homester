package com.example.Homester.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.Homester.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUserId(Long userId);

    @Query("SELECT m FROM Message m WHERE m.userId = :userId OR m.houseId IN (SELECT h.id FROM House h WHERE h.userId = :userId)")
    List<Message> findMessagesRelatedToUser(@Param("userId") Long userId);
}
