package com.dormmanager.controller;

import com.dormmanager.dto.ChambreRequestDto;
import com.dormmanager.entity.Chambre;
import com.dormmanager.repository.ChambreRepository;
import com.dormmanager.services.AdminService;
import com.dormmanager.services.GestionnaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour les opérations liées aux chambres.
 * Expose les endpoints pour créer et lister les chambres.
 */
@RestController
@RequestMapping("/api/chambres")
@CrossOrigin(origins = "http://localhost:3000")
public class ChambreController {

    private final GestionnaireService gestionnaireService;
    private final AdminService adminService;
    private final ChambreRepository chambreRepository;

    public ChambreController(GestionnaireService gestionnaireService, 
                            AdminService adminService,
                            ChambreRepository chambreRepository) {
        this.gestionnaireService = gestionnaireService;
        this.adminService = adminService;
        this.chambreRepository = chambreRepository;
    }

    /**
     * Récupère la liste de toutes les chambres (disponibles et occupées).
     */
    @GetMapping
    public List<Chambre> toutesLesChambres() {
        return chambreRepository.findAll();
    }

    /**
     * Récupère uniquement les chambres disponibles.
     */
    @GetMapping("/disponibles")
    public List<Chambre> getChambresDisponibles() {
        return gestionnaireService.getChambresDisponibles();
    }

    /**
     * Ajoute une nouvelle chambre.
     * Accepts userId in the request body to determine if admin or gestionnaire is adding the chambre.
     */
    @PostMapping
    public ResponseEntity<Chambre> ajouterChambre(@RequestBody ChambreRequestDto dto) {
        Chambre chambre = gestionnaireService.ajouterChambre(dto);
        
        // Get the user ID from the DTO (passed from frontend)
        Long userId = dto.getUserId();
        
        if (userId != null) {
            // Check if the user is an admin or gestionnaire and send appropriate notifications
            gestionnaireService.notifyOnChambreAdd(chambre, userId);
        } else {
            // Fallback: if no userId provided, notify admins (assume gestionnaire is adding)
            gestionnaireService.notifyAdminsOnChambreAdd(chambre);
        }
        
        return ResponseEntity.ok(chambre);
    }

    /**
     * Met à jour une chambre existante.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Chambre> updateChambre(@PathVariable Long id, @RequestBody ChambreRequestDto dto) {
        Chambre chambre = chambreRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Chambre non trouvée"));
        
        chambre.setNumero(dto.getNumero());
        chambre.setType(dto.getType());
        chambre.setCapacite(dto.getCapacite());
        chambre.setEtat(dto.getEtat());
        
        Chambre updated = chambreRepository.save(chambre);
        // Notify gestionnaires when admin updates a chambre
        adminService.notifyGestionnairesOnChambreUpdate(updated);
        return ResponseEntity.ok(updated);
    }

    /**
     * Supprime une chambre.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChambre(@PathVariable Long id) {
        Chambre chambre = chambreRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Chambre non trouvée"));
        String chambreNumero = chambre.getNumero();
        
        chambreRepository.deleteById(id);
        // Notify gestionnaires when admin deletes a chambre
        adminService.notifyGestionnairesOnChambreDelete(chambreNumero);
        return ResponseEntity.noContent().build();
    }
}
