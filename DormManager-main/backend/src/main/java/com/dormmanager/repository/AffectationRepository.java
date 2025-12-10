package com.dormmanager.repository;

import com.dormmanager.entity.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AffectationRepository extends JpaRepository<Affectation, Long> {
}
