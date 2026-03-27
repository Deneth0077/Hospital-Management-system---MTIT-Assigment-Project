package com.hospital.ward.repository;

import com.hospital.ward.model.Ward;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WardRepository extends MongoRepository<Ward, String> {
    Optional<Ward> findByType(String type);
}
