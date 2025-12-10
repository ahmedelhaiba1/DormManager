
package com.dormmanager.controller;

import com.dormmanager.dto.AffectationRequestDto;
import com.dormmanager.dto.ChambreRequestDto;
import com.dormmanager.dto.DashboardStatsDto;
import com.dormmanager.dto.DemandeHebergementDto;
import com.dormmanager.dto.ReclamationDto;
import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.Chambre;
import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Reclamation;
import com.dormmanager.repository.ReclamationRepository;
import com.dormmanager.services.GestionnaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gestionnaire")
@CrossOrigin(origins = "*")
public class GestionnaireController {

    private final GestionnaireService gestionnaireService;
    private final ReclamationRepository reclamationRepository;
    private final com.dormmanager.services.NotificationService notificationService;

    public GestionnaireController(GestionnaireService gestionnaireService,
                                  ReclamationRepository reclamationRepository,
                                  com.dormmanager.services.NotificationService notificationService) {
        this.gestionnaireService = gestionnaireService;
        this.reclamationRepository = reclamationRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/demandes/en-attente")
    public List<DemandeHebergementDto> getDemandesEnAttente() {
        return gestionnaireService.getDemandesEnAttente();
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        DashboardStatsDto stats = gestionnaireService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/chambres/disponibles")
    public List<Chambre> getChambresDisponibles() {
        return gestionnaireService.getChambresDisponibles();
    }

    @PostMapping("/chambres")
    public ResponseEntity<Chambre> ajouterChambre(@RequestBody ChambreRequestDto dto) {
        Chambre chambre = gestionnaireService.ajouterChambre(dto);
        return ResponseEntity.ok(chambre);
    }

    @GetMapping("/reclamations")
    public List<ReclamationDto> getDernieresReclamations() {
        return gestionnaireService.getDernieresReclamations();
    }

    @PostMapping("/demandes/affecter")
    public ResponseEntity<Affectation> affecterEtValider(@RequestBody AffectationRequestDto dto) {
        Affectation affectation = gestionnaireService.affecterEtValiderDemande(dto);
        return ResponseEntity.ok(affectation);
    }

    @PostMapping("/demandes/{id}/rejeter")
    public ResponseEntity<DemandeHebergement> rejeterDemande(@PathVariable Long id,
                                                             @RequestParam(required = false) String motif) {
        DemandeHebergement demande = gestionnaireService.rejeterDemande(id, motif);
        return ResponseEntity.ok(demande);
    }

    // Update reclamation status to EN_COURS
    @PutMapping("/reclamations/{id}/prendre-en-charge")
    public ResponseEntity<ReclamationDto> prendreEnChargeReclamation(@PathVariable Long id) {
        Reclamation rec = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation non trouvée"));
        rec.setStatus(Reclamation.StatutReclamation.EN_COURS);
        Reclamation updated = reclamationRepository.save(rec);
        // Notify the author of the reclamation
        if (updated.getUtilisateur() != null) {
            notificationService.sendNotification(
                    updated.getUtilisateur(),
                    "info",
                    "Réclamation en cours",
                    "Votre réclamation est en cours de traitement"
            );
        }
        return ResponseEntity.ok(new ReclamationDto(updated));
    }

    // Update reclamation status to RESOLUE
    @PutMapping("/reclamations/{id}/resoudre")
    public ResponseEntity<ReclamationDto> resoudreReclamation(@PathVariable Long id) {
        Reclamation rec = reclamationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réclamation non trouvée"));
        rec.setStatus(Reclamation.StatutReclamation.RESOLUE);
        Reclamation updated = reclamationRepository.save(rec);
        // Notify the author of the reclamation
        if (updated.getUtilisateur() != null) {
            notificationService.sendNotification(
                    updated.getUtilisateur(),
                    "info",
                    "Réclamation résolue",
                    "Votre réclamation a été résolue"
            );
        }
        return ResponseEntity.ok(new ReclamationDto(updated));
    }

}

/**
 * GestionnaireController
 * 
 * Gère les opérations liées au gestionnaire de dortoirs :
 *  - gestion des demandes d'hébergement
 *  - gestion des chambres (disponibles)
 *  - consultation des réclamations récentes
 *  - affectation des chambres aux étudiants
**/
