
package com.dormmanager.controller;

import com.dormmanager.entity.Utilisateur;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.repository.UtilisateurRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;

    // Stores token → userId
    public static final Map<String, Long> sessions = new ConcurrentHashMap<>();

    public AuthController(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public static class LoginRequest {
        public String email;
        public String motDePasse;
    }

    // 🔹 Simple in-memory token store (for demo)
    public static final Map<String, String> activeTokens = new HashMap<>();

    // LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        Utilisateur u = utilisateurRepository.findByEmail(req.email);
        if (u == null || !u.getMotDePasse().equals(req.motDePasse)) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        String token = UUID.randomUUID().toString();
        sessions.put(token, u.getId());

        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("id", u.getId());
        res.put("nom", u.getNom());
        res.put("prenom", u.getPrenom());
        res.put("email", u.getEmail());
        res.put("role", u.getRole().name());

        if (u instanceof Etudiant) {
            Etudiant e = (Etudiant) u;
            res.put("matricule", e.getMatricule());
            res.put("filiere", e.getFiliere());
        }

        return res;
    }

        // 🔹 Optional token verification
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestParam String token) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token manquant");
        }
        
        // Check sessions (used by login)
        if (sessions.containsKey(token)) {
            return ResponseEntity.ok("Token valide");
        }
        
        // Check activeTokens (used by registration)
        if (activeTokens.containsKey(token)) {
            return ResponseEntity.ok("Token valide");
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalide ou expiré");
    }

    // 🔹 Optional logout endpoint (if needed later)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String token) {
        activeTokens.remove(token);
        return ResponseEntity.ok("Déconnecté avec succès");
    }

    // Retourne l'utilisateur associé au token fourni (ou lève une RuntimeException si invalide)
    public Utilisateur getLoggedUser(String token) {
        if (token == null) throw new RuntimeException("Token manquant");

        // First try numeric-id sessions (used by login)
        Long userId = sessions.get(token);
        if (userId != null) {
            return utilisateurRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable pour ce token"));
        }

        // Fallback to activeTokens map (some controllers store token -> email)
        String email = activeTokens.get(token);
        if (email != null) {
            Utilisateur u = utilisateurRepository.findByEmail(email);
            if (u != null) return u;
            throw new RuntimeException("Utilisateur introuvable pour ce token (email)");
        }

        throw new RuntimeException("Token invalide ou expiré");
    }

}

