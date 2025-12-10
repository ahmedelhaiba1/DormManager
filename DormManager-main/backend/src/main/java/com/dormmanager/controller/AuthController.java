package com.dormmanager.controller;

import com.dormmanager.entity.Utilisateur;
import com.dormmanager.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    // 🔹 Inner class for login request
    public static class LoginRequest {
        public String email;
        public String motDePasse;
    }

    // 🔹 Simple in-memory token store (for demo)
    public static final Map<String, String> activeTokens = new HashMap<>();

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    Utilisateur user = utilisateurRepository.findByEmail(request.email);

    if (user != null && user.getMotDePasse().equals(request.motDePasse)) {
        String token = UUID.randomUUID().toString();
        activeTokens.put(token, user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("nom", user.getNom());
        response.put("prenom", user.getPrenom());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());

        // Add these lines
        if (user instanceof com.dormmanager.entity.Etudiant) {
            com.dormmanager.entity.Etudiant etudiant =
                    (com.dormmanager.entity.Etudiant) user;
            response.put("matricule", etudiant.getMatricule());
            response.put("filiere", etudiant.getFiliere());
        }

        return ResponseEntity.ok(response);
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Email ou mot de passe incorrect");
    }


    // 🔹 Optional token verification
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestParam String token) {
        if (token == null || !activeTokens.containsKey(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalide ou expiré");
        }
        return ResponseEntity.ok("Token valide");
    }

    // 🔹 Optional logout endpoint (if needed later)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String token) {
        activeTokens.remove(token);
        return ResponseEntity.ok("Déconnecté avec succès");
    }
}
