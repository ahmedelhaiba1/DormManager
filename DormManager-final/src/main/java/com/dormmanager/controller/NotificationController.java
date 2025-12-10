package com.dormmanager.controller;

import com.dormmanager.dto.NotificationDTO;
import com.dormmanager.entity.Notification;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.repository.NotificationRepository;
import com.dormmanager.repository.UtilisateurRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import com.dormmanager.controller.AuthController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final AuthController authController;

    public NotificationController(NotificationRepository notificationRepository,
                                  UtilisateurRepository utilisateurRepository,
                                  AuthController authController) {
        this.notificationRepository = notificationRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.authController = authController;
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    // GET notifications for logged user
    @GetMapping("/me")
    public List<NotificationDTO> getMyNotifications(HttpServletRequest request) {
        String token = extractToken(request);
        Utilisateur user = authController.getLoggedUser(token);

        return notificationRepository.findByDestinataireOrderByDateDesc(user)
                .stream()
                .map(n -> new NotificationDTO(
                        n.getId(),
                        n.getType(),
                        n.getTitre(),
                        n.getMessage(),
                        n.getDate(),
                        n.isLu()
                ))
                .toList();
    }

    // GET stats
    @GetMapping("/me/stats")
    public Object getStats(HttpServletRequest request) {
        String token = extractToken(request);
        Utilisateur user = authController.getLoggedUser(token);

        long unread = notificationRepository.countByDestinataireAndLuFalse(user);
        long total = notificationRepository.countByDestinataire(user);

        class Stats {
            public long unread;
            public long total;
            public Stats(long unread, long total) {
                this.unread = unread;
                this.total = total;
            }
        }
        return new Stats(unread, total);
    }

    // Mark 1 as read
    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        n.setLu(true);
        notificationRepository.save(n);
    }

    // Mark ALL as read
    @PutMapping("/read-all")
    public void markAllRead(HttpServletRequest request) {
        String token = extractToken(request);
        Utilisateur user = authController.getLoggedUser(token);

        List<Notification> list = notificationRepository.findByDestinataireOrderByDateDesc(user);
        list.forEach(n -> n.setLu(true));
        notificationRepository.saveAll(list);
    }
}
