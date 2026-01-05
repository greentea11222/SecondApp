package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Memo;

public interface MemoryRepository extends JpaRepository<Memo, Long> {

}
