package com.dormmanager.repository;

import com.dormmanager.entity.Notification;
import com.dormmanager.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByDestinataireOrderByDateDesc(Utilisateur user);

    long countByDestinataireAndLuFalse(Utilisateur user);

    long countByDestinataire(Utilisateur user);

    /**
     * Delete all notifications for a given user (used when deleting a user account)
     */
    void deleteByDestinataireId(Long utilisateurId);
}
