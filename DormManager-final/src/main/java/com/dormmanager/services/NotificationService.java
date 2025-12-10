package com.dormmanager.services;

import com.dormmanager.entity.Notification;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.repository.NotificationRepository;
import com.dormmanager.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UtilisateurRepository utilisateurRepository) {
        this.notificationRepository = notificationRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public Notification sendNotification(Utilisateur destinataire, String type, String titre, String message) {
        Notification n = new Notification();
        n.setDestinataire(destinataire);
        n.setType(type);
        n.setTitre(titre);
        n.setMessage(message);
        n.setDate(LocalDateTime.now());
        n.setLu(false);
        return notificationRepository.save(n);
    }

    public void notifyAllGestionnaires(String type, String titre, String message) {
        List<Utilisateur> gestionnaires = utilisateurRepository.findByRole(Utilisateur.Role.GESTIONNAIRE);
        for (Utilisateur g : gestionnaires) {
            sendNotification(g, type, titre, message);
        }
    }

    public void notifyAllAdmins(String type, String titre, String message) {
        List<Utilisateur> admins = utilisateurRepository.findByRole(Utilisateur.Role.ADMIN);
        for (Utilisateur admin : admins) {
            sendNotification(admin, type, titre, message);
        }
    }
}
