package com.dormmanager.repository;

import com.dormmanager.entity.DemandeHebergement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DemandeHebergementRepository extends JpaRepository<DemandeHebergement, Long> {
    List<DemandeHebergement> findByEtudiantId(Long etudiantId);
}
