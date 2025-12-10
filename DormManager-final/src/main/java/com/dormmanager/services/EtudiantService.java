package com.dormmanager.services;

import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.Reclamation;
import com.dormmanager.entity.StatutDemande;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.repository.AffectationRepository;
import com.dormmanager.repository.ChambreRepository;
import com.dormmanager.repository.DemandeHebergementRepository;
import com.dormmanager.repository.EtudiantRepository;
import com.dormmanager.repository.ReclamationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 * Service métier pour les fonctionnalités liées à l'étudiant :
 *  - Demandes d'hébergement
 *  - Réclamations
 *  - Affectation actuelle
 */
@Service
public class EtudiantService {

    private final DemandeHebergementRepository demandeRepo;
    private final EtudiantRepository etudiantRepo;
    private final ReclamationRepository reclamationRepo;
    private final AffectationRepository affectationRepo;
    private final ChambreRepository chambreRepo;
    private final com.dormmanager.services.NotificationService notificationService;

    public EtudiantService(DemandeHebergementRepository demandeRepo,
                           EtudiantRepository etudiantRepo,
                           ReclamationRepository reclamationRepo,
                           AffectationRepository affectationRepo,
                           ChambreRepository chambreRepo,
                           com.dormmanager.services.NotificationService notificationService) {
        this.demandeRepo = demandeRepo;
        this.etudiantRepo = etudiantRepo;
        this.reclamationRepo = reclamationRepo;
        this.affectationRepo = affectationRepo;
        this.chambreRepo = chambreRepo;
        this.notificationService = notificationService;
    }

    // =========================
    // 🔹 Demandes d'hébergement
    // =========================

    /**
     * Création d'une nouvelle demande pour un étudiant donné.
     */
    public DemandeHebergement createDemande(Long etudiantId, String motif) {
        Etudiant etudiant = etudiantRepo.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        // RULE A: Check if student already has an ACTIVE affectation
        // An affectation is considered ACTIVE only if:
        // 1. dateFin IS NULL (no end date) OR dateFin > today (still in the future), AND
        // 2. The room is still marked as 'occupee' in the database
        // 
        // After an affectation expires:
        // - Scheduler sets the room to 'disponible' (if no newer affectation exists)
        // - Query won't find it because etat != 'occupee'
        // - Student can create a new demande ✅
        boolean hasActiveAffectation = affectationRepo.existsActiveAffectationByEtudiantId(
                etudiantId, 
                java.time.LocalDate.now()
        );
        
        if (hasActiveAffectation) {
            // Send notification about blocked demande
            notificationService.sendNotification(
                etudiant,
                "error",
                "Demande impossible",
                "Vous occupez déjà une chambre. Vous ne pouvez pas soumettre une nouvelle demande."
            );
            throw new RuntimeException("Vous occupez déjà une chambre.");
        }

        // RULE B: Check if student already has a pending demande (EN_ATTENTE)
        boolean hasPendingDemande = demandeRepo.existsByEtudiantIdAndStatut(
                etudiantId, 
                StatutDemande.EN_ATTENTE
        );
        
        if (hasPendingDemande) {
            throw new RuntimeException("Vous avez déjà une demande en attente. Veuillez attendre qu'elle soit traitée.");
        }

        DemandeHebergement demande = new DemandeHebergement();
        demande.setDateSoumission(new Date());
        demande.setMotif(motif);
        demande.setStatut(StatutDemande.EN_ATTENTE);
        demande.setEtudiant(etudiant);

        DemandeHebergement saved = demandeRepo.save(demande);

        // Notify all gestionnaires of a new demande
        notificationService.notifyAllGestionnaires(
            "message",
            "Nouvelle demande d'hébergement",
            "Une nouvelle demande a été soumise par " + etudiant.getPrenom() + " " + etudiant.getNom()
        );

        return saved;
    }

    /**
     * Liste des demandes d'un étudiant.
     */
    public List<DemandeHebergement> getDemandesByEtudiant(Long etudiantId) {
        return demandeRepo.findByEtudiantId(etudiantId);
    }

    /**
     * Nombre de demandes en cours (EN_ATTENTE) pour un étudiant.
     */
    public long countDemandesEnCours(Etudiant etudiant) {
        return demandeRepo.countByEtudiantAndStatut(etudiant, StatutDemande.EN_ATTENTE);
    }

    // =========================
    // 🔹 Réclamations
    // =========================

    /**
     * Liste des réclamations d'un utilisateur (étudiant).
     */
    public List<Reclamation> getReclamations(Utilisateur utilisateur) {
        return reclamationRepo.findByUtilisateurOrderByDateEnvoiDesc(utilisateur);
    }

    /**
     * Création d'une nouvelle réclamation pour l'utilisateur connecté.
     */
    public Reclamation createReclamation(Utilisateur utilisateur, String message) {
        Reclamation r = new Reclamation();
        r.setMessage(message);
        r.setDateEnvoi(LocalDate.now());
        r.setUtilisateur(utilisateur);
        Reclamation saved = reclamationRepo.save(r);

        // Notify gestionnaires of a new reclamation
        notificationService.notifyAllGestionnaires(
                "warning",
                "Nouvelle réclamation",
                "Une nouvelle réclamation a été soumise par " + utilisateur.getPrenom() + " " + utilisateur.getNom()
        );

        return saved;
    }

    /**
     * Nombre total de réclamations d'un utilisateur.
     */
    public long countReclamations(Utilisateur utilisateur) {
        return reclamationRepo.countByUtilisateur(utilisateur);
    }

    // =========================
    // 🔹 Affectation actuelle
    // =========================

    /**
     * Récupère la dernière affectation (la plus récente) de l'étudiant.
     * On se base uniquement sur l'identifiant de l'étudiant pour éviter
     * tout problème d'instance détachée ou d'héritage (Utilisateur/Etudiant).
     *
     * Cette méthode considère comme "actuelle" la dernière affectation
     * enregistrée pour l'étudiant, qu'elle commence dans le futur ou qu'elle
     * soit déjà en cours. Ainsi, dès que le gestionnaire affecte une chambre
     * à un étudiant, celle‑ci est visible dans l'espace étudiant.
     * 
     * IMPORTANT: Ne retourne que les affectations actives:
     * - dateFin est NULL (pas de date de fin), OU
     * - dateFin est aujourd'hui ou après (l'étudiant peut encore utiliser la chambre aujourd'hui)
     * 
     * LOGIQUE DATE: Si dateFin est 12/05 et aujourd'hui est 12/05, l'affectation est ACTIVE
     * car l'étudiant peut utiliser la chambre le 12/05. 
     * On ne cache l'affectation que si dateFin est AVANT aujourd'hui (dateFin < today).
     */
    public Affectation getCurrentAffectation(Etudiant etudiant) {
        if (etudiant == null || etudiant.getId() == null) {
            return null;
        }
        Affectation aff = affectationRepo.findTopByEtudiantIdOrderByDateDebutDesc(etudiant.getId());
        
        // Only return if affectation is still active (dateFin is null or after/equal to today)
        if (aff != null) {
            LocalDate today = LocalDate.now();
            System.out.println("🔵 [DEBUG] Affectation dateDebut: " + aff.getDateDebut() + ", dateFin: " + aff.getDateFin() + ", today: " + today);
            // Affectation is active if: dateFin is null OR dateFin is after/equal to today
            // Only hide if dateFin is BEFORE today (strictly in the past)
            if (aff.getDateFin() != null && aff.getDateFin().isBefore(today)) {
                System.out.println("❌ [DEBUG] Affectation expirée (dateFin strictement avant aujourd'hui)");
                return null; // Affectation has ended (dateFin is before today)
            }
        }
        
        return aff;
    }

    /**
     * Alias de getCurrentAffectation pour compatibilité éventuelle.
     */
    public Affectation getLatestAffectation(Etudiant etudiant) {
        return getCurrentAffectation(etudiant);
    }

    /**
     * Permet à un étudiant de quitter sa chambre en avance.
     * - Met à jour la dateFin à aujourd'hui
     * - Ajoute une remarque si fournie
     * - Met la chambre en DISPONIBLE
     */
    public void quitterAffectation(Etudiant etudiant, String remarque) {
        Affectation aff = getCurrentAffectation(etudiant);
        if (aff == null) {
            throw new RuntimeException("Vous n'avez pas d'affectation active");
        }

        // Set end date to today
        aff.setDateFin(java.time.LocalDate.now());
        
        // Add remark if provided
        if (remarque != null && !remarque.trim().isEmpty()) {
            aff.setRemarque(remarque);
        }

        // Save affectation update
        affectationRepo.save(aff);

        // Free the room
        if (aff.getChambre() != null) {
            aff.getChambre().setEtat("disponible");
            chambreRepo.save(aff.getChambre());
        }

        // Send notification to student
        notificationService.sendNotification(
            etudiant,
            "info",
            "Affectation terminée",
            "Vous avez quitté votre chambre. Vous pouvez désormais soumettre une nouvelle demande."
        );
    }
    



}
