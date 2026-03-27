package com.hospital.ward.repository;

import com.hospital.ward.model.Bed;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends MongoRepository<Bed, String> {
    List<Bed> findByWardId(String wardId);
    Optional<Bed> findFirstByWardIdAndStatus(String wardId, String status);
}
