package com.dormmanager.controller;

import com.dormmanager.entity.Reclamation;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.services.EtudiantService;
import com.dormmanager.controller.AuthController;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour la gestion des réclamations côté étudiant :
 *  - liste des réclamations de l'étudiant connecté
 *  - création d'une nouvelle réclamation
 *  - comptage pour le tableau de bord
 */
@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReclamationController {

    private final EtudiantService etudiantService;
    private final AuthController authController;

    public ReclamationController(EtudiantService etudiantService,
                                 AuthController authController) {
        this.etudiantService = etudiantService;
        this.authController = authController;
    }

    private String extractToken(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        if (h != null && h.startsWith("Bearer ")) return h.substring(7);
        return null;
    }

    // =========================
    //  Liste des réclamations de l'étudiant connecté
    // =========================
    @GetMapping("/me")
    public List<Reclamation> getMyReclamations(HttpServletRequest req) {
        String token = extractToken(req);
        Utilisateur u = authController.getLoggedUser(token);
        return etudiantService.getReclamations(u);
    }

    // =========================
    //  Création d'une nouvelle réclamation
    // =========================
    @PostMapping
    public Reclamation createReclamation(@RequestBody Map<String, String> body,
                                         HttpServletRequest req) {
        String token = extractToken(req);
        Utilisateur u = authController.getLoggedUser(token);
        return etudiantService.createReclamation(u, body.get("message"));
    }

    // =========================
    //  Nombre de réclamations (pour le dashboard)
    // =========================
    @GetMapping("/me/count")
    public Map<String, Long> getMyReclamationsCount(HttpServletRequest req) {
        String token = extractToken(req);
        Utilisateur u = authController.getLoggedUser(token);
        return Map.of("count", etudiantService.countReclamations(u));
    }
}
