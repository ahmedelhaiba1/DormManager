package com.dormmanager.controller;

import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.repository.DemandeHebergementRepository;
import com.dormmanager.services.DemandeHebergementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = "*")
public class DemandeController {

    private final DemandeHebergementService demandeService;

    public DemandeController(DemandeHebergementService demandeService) {
        this.demandeService = demandeService;
    }

    // ✅ 1. Create a new demande
    @PostMapping
    public DemandeHebergement createDemande(@RequestBody Map<String, Object> payload) {
        Long etudiantId = Long.valueOf(payload.get("etudiantId").toString());
        String motif = payload.get("motif").toString();
        return demandeService.createDemande(etudiantId, motif);
    }

    // ✅ 2. Get all demandes
    @GetMapping
    public List<DemandeHebergement> getAllDemandes() {
        return demandeService.getAllDemandes();
    }

    // ✅ 3. Get demandes by student
    @GetMapping("/etudiant/{id}")
    public List<DemandeHebergement> getDemandesByEtudiant(@PathVariable Long id) {
        return demandeService.getDemandesByEtudiant(id);
    }

    // ✅ 4. Validate demande
    @PutMapping("/{id}/valider")
    public DemandeHebergement validerDemande(@PathVariable Long id) {
        return demandeService.validerDemande(id);
    }

    // ✅ 5. Reject demande
    @PutMapping("/{id}/rejeter")
    public DemandeHebergement rejeterDemande(@PathVariable Long id) {
        return demandeService.rejeterDemande(id);
    }

}

