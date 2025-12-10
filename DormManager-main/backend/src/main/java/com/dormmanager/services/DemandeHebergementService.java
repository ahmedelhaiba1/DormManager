/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dormmanager.services;

/**
 *
 * @author User
 */

import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.StatutDemande;
import com.dormmanager.repository.DemandeHebergementRepository;
import com.dormmanager.repository.EtudiantRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class DemandeHebergementService {

    private final DemandeHebergementRepository demandeRepo;
    private final EtudiantRepository etudiantRepo;

    public DemandeHebergementService(DemandeHebergementRepository demandeRepo, EtudiantRepository etudiantRepo) {
        this.demandeRepo = demandeRepo;
        this.etudiantRepo = etudiantRepo;
    }

    // 1️⃣ Create a new demande
    public DemandeHebergement createDemande(Long etudiantId, String motif) {
        Etudiant etudiant = etudiantRepo.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        DemandeHebergement demande = new DemandeHebergement();
        demande.setDateSoumission(new Date());
        demande.setMotif(motif);
        demande.setStatut(StatutDemande.EN_ATTENTE);
        demande.setEtudiant(etudiant);

        return demandeRepo.save(demande);
    }

    // 2️⃣ Get all demandes
    public List<DemandeHebergement> getAllDemandes() {
        return demandeRepo.findAll();
    }

    // 3️⃣ Get demandes by student
    public List<DemandeHebergement> getDemandesByEtudiant(Long etudiantId) {
        return demandeRepo.findByEtudiantId(etudiantId);
    }

    // 4️⃣ Validate demande
    public DemandeHebergement validerDemande(Long id) {
        DemandeHebergement demande = demandeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        demande.setStatut(StatutDemande.VALIDEE);
        return demandeRepo.save(demande);
    }

    // 5️⃣ Reject demande
    public DemandeHebergement rejeterDemande(Long id) {
        DemandeHebergement demande = demandeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        demande.setStatut(StatutDemande.REJETEE);
        return demandeRepo.save(demande);
    }
}
