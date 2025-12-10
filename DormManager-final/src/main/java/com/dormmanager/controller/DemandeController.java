package com.dormmanager.controller;

import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.services.EtudiantService;
import com.dormmanager.services.GestionnaireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "*")
public class DemandeController {

    private final EtudiantService etudiantService;
    private final GestionnaireService gestionnaireService;

    public DemandeController(EtudiantService etudiantService,
                             GestionnaireService gestionnaireService) {
        this.etudiantService = etudiantService;
        this.gestionnaireService = gestionnaireService;
    }

    // 1. Create a new demande (Etudiant)
    @PostMapping
    public ResponseEntity<?> createDemande(@RequestBody Map<String, Object> payload) {
        try {
            Long etudiantId = Long.valueOf(payload.get("etudiantId").toString());
            String motif = payload.get("motif").toString();
            DemandeHebergement demande = etudiantService.createDemande(etudiantId, motif);
            return ResponseEntity.ok(demande);
        } catch (RuntimeException e) {
            // If the error message is about already having a room, return 400 BAD REQUEST
            if (e.getMessage().contains("occupez déjà")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", e.getMessage()));
            }
            // For other runtime exceptions, return 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 2. Get all demandes (Gestionnaire)
    @GetMapping
    public List<DemandeHebergement> getAllDemandes() {
        return gestionnaireService.getAllDemandes();
    }

    // 3. Get demandes by student (Etudiant)
    @GetMapping("/etudiant/{id}")
    public List<DemandeHebergement> getDemandesByEtudiant(@PathVariable Long id) {
        return etudiantService.getDemandesByEtudiant(id);
    }

    // 4. Validate demande (Gestionnaire)
    @PutMapping("/{id}/valider")
    public DemandeHebergement validerDemande(@PathVariable Long id) {
        return gestionnaireService.validerDemande(id);
    }

    // 5. Reject demande (Gestionnaire)
    @PutMapping("/{id}/rejeter")
    public DemandeHebergement rejeterDemande(@PathVariable Long id) {
        return gestionnaireService.rejeterDemande(id);
    }
}
