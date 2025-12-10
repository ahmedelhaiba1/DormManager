package com.dormmanager.repository;

import com.dormmanager.entity.Reclamation;
import com.dormmanager.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    // 10 dernières réclamations (les plus récentes)
    List<Reclamation> findTop10ByOrderByDateEnvoiDesc();

    // Réclamations d'un utilisateur, triées par date d'envoi décroissante
    List<Reclamation> findByUtilisateurOrderByDateEnvoiDesc(Utilisateur utilisateur);

    // Nombre total de réclamations d'un utilisateur
    long countByUtilisateur(Utilisateur utilisateur);

    // Nombre de réclamations en attente (status = EN_ATTENTE ou NULL)
    @Query("SELECT COUNT(r) FROM Reclamation r WHERE r.status = 'EN_ATTENTE' OR r.status IS NULL")
    long countByEnAttenteOrNull();

    /**
     * Delete all complaints for a given user (used when deleting a student account)
     */
    void deleteByUtilisateurId(Long utilisateurId);

}
