package com.hospital.ward.repository;

import com.hospital.ward.model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {
    List<Staff> findByWardId(String wardId);
    List<Staff> findByWardIdAndRole(String wardId, String role);
    Optional<Staff> findFirstByWardIdAndRole(String wardId, String role);
}
