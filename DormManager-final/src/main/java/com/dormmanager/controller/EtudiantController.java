package com.dormmanager.controller;

import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.services.EtudiantService;
import com.dormmanager.repository.EtudiantRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dormmanager.controller.AuthController;
import java.util.HashMap;
import java.util.UUID;


import java.util.Map;

/**
 * Contrôleur REST pour les opérations liées aux étudiants :
 *  - inscription
 *  - consultation / gestion (pour usage futur)
 *  - endpoints de tableau de bord : demandes en cours, affectation
 */
@RestController
@RequestMapping("/api/etudiants")
@CrossOrigin(origins = "http://localhost:3000")
public class EtudiantController {

    private final EtudiantRepository etudiantRepository;
    private final EtudiantService etudiantService;
    private final AuthController authController;

    public EtudiantController(EtudiantRepository etudiantRepository,
                              EtudiantService etudiantService,
                              AuthController authController) {
        this.etudiantRepository = etudiantRepository;
        this.etudiantService = etudiantService;
        this.authController = authController;
    }

    private String extractToken(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        if (h != null && h.startsWith("Bearer ")) return h.substring(7);
        return null;
    }

    // REGISTRATION
     @PostMapping("/register")
    public Map<String, Object> registerEtudiant(@RequestBody Etudiant etudiant) {

    etudiant.setRole(Utilisateur.Role.ETUDIANT);
    Etudiant saved = etudiantRepository.save(etudiant);

    // Generate a session token
    String token = UUID.randomUUID().toString();

    // IMPORTANT: Add the token to the same active token map used in AuthController
    AuthController.activeTokens.put(token, saved.getEmail());

    Map<String, Object> response = new HashMap<>();
    response.put("user", saved);
    response.put("token", token);

    return response;
}

    // =========================
    // 🔹 CRUD de base (admin futur)
    // =========================

    @GetMapping("/{id}")
    public Etudiant getEtudiant(@PathVariable Long id) {
        return etudiantRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Etudiant createEtudiant(@RequestBody Etudiant etudiant) {
        return etudiantRepository.save(etudiant);
    }

    @PutMapping("/{id}")
    public Etudiant updateEtudiant(@PathVariable Long id, @RequestBody Etudiant etudiant) {
        Etudiant existing = etudiantRepository.findById(id).orElseThrow();
        existing.setFiliere(etudiant.getFiliere());
        existing.setMatricule(etudiant.getMatricule());
        existing.setNom(etudiant.getNom());
        existing.setPrenom(etudiant.getPrenom());
        return etudiantRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteEtudiant(@PathVariable Long id) {
        etudiantRepository.deleteById(id);
    }

    // =========================
    // 🔹 Endpoints tableau de bord étudiant
    // =========================

    /**
     * Nombre de demandes d'hébergement en cours (EN_ATTENTE) pour l'étudiant connecté.
     */
    @GetMapping("/me/demandes/count-en-cours")
    public Map<String, Long> getMyPendingDemandes(HttpServletRequest request) {
        String token = extractToken(request);
        Utilisateur u = authController.getLoggedUser(token);

        if (!(u instanceof Etudiant)) {
            throw new RuntimeException("L'utilisateur connecté n'est pas un étudiant");
        }
        Etudiant etudiant = (Etudiant) u;

        long count = etudiantService.countDemandesEnCours(etudiant);
        return Map.of("count", count);
    }

    // CURRENT AFFECTATION
    @GetMapping("/me/affectation")
    public ResponseEntity<?> getMyAffectation(HttpServletRequest req) {
        String token = extractToken(req);
        Utilisateur u = authController.getLoggedUser(token);

        if (!(u instanceof Etudiant et)) {
            throw new RuntimeException("Utilisateur non étudiant");
        }

        Affectation aff = etudiantService.getCurrentAffectation(et);
        if (aff == null) return ResponseEntity.ok(Map.of());

        // Build a response map that allows null values (Map.of disallows nulls)
        Map<String, Object> resp = new HashMap<>();
        if (aff.getChambre() != null) {
            resp.put("chambreNumero", aff.getChambre().getNumero());
            resp.put("chambreType", aff.getChambre().getType());
        } else {
            resp.put("chambreNumero", null);
            resp.put("chambreType", null);
        }
        resp.put("dateDebut", aff.getDateDebut());
        resp.put("dateFin", aff.getDateFin());
        resp.put("remarque", aff.getRemarque());

        return ResponseEntity.ok(resp);
    }

    // LEAVE EARLY - End affectation and free the room
    @PostMapping("/me/affectation/quitter")
    public ResponseEntity<?> quitterChambre(HttpServletRequest req, @RequestBody(required = false) Map<String, String> body) {
        String token = extractToken(req);
        Utilisateur u = authController.getLoggedUser(token);

        if (!(u instanceof Etudiant et)) {
            throw new RuntimeException("Utilisateur non étudiant");
        }

        String remarque = body != null ? body.get("remarque") : null;
        etudiantService.quitterAffectation(et, remarque);
        
        return ResponseEntity.ok(Map.of("message", "Vous avez quitté la chambre avec succès"));
    }

}