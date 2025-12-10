package com.dormmanager.repository;

import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DemandeHebergementRepository extends JpaRepository<DemandeHebergement, Long> {
    List<DemandeHebergement> findByEtudiantId(Long etudiantId);

    long countByEtudiantAndStatut(Etudiant etudiant, StatutDemande statut);

    long countByStatut(StatutDemande statut);

    List<DemandeHebergement> findByStatutOrderByDateSoumissionDesc(StatutDemande statut);

    boolean existsByEtudiantIdAndStatut(Long etudiantId, StatutDemande statut);

    /**
     * Delete all housing requests for a given student (used when deleting a student account)
     */
    void deleteByEtudiantId(Long etudiantId);

}
