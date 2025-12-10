package com.dormmanager.controller;

import com.dormmanager.dto.DashboardStatsDto;
import com.dormmanager.entity.Chambre;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.services.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminController - Endpoints for admin panel statistics and management
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Get all dashboard statistics for admin panel
     */
    @GetMapping("/stats")
    public DashboardStatsDto getStats() {
        return adminService.getDashboardStats();
    }

    /**
     * Get all chambres (regardless of status)
     */
    @GetMapping("/chambres")
    public List<Chambre> toutesLesChambres() {
        return adminService.toutesLesChambres();
    }

    /**
     * Create a new user (Gestionnaire, Agent Technique, or Admin)
     */
    @PostMapping("/users")
    public ResponseEntity<Utilisateur> createUser(@RequestBody CreateUserRequest request) {
        try {
            Utilisateur user = adminService.createUtilisateur(
                    request.getNom(),
                    request.getPrenom(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getRole()
            );
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DTO for creating a new user
     */
    public static class CreateUserRequest {
        private String nom;
        private String prenom;
        private String email;
        private String password;
        private String role;

        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }

        public String getPrenom() { return prenom; }
        public void setPrenom(String prenom) { this.prenom = prenom; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
