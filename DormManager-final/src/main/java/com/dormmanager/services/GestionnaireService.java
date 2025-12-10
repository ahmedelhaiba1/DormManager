package com.dormmanager.services;

import com.dormmanager.dto.AffectationRequestDto;
import com.dormmanager.dto.ChambreRequestDto;
import com.dormmanager.dto.DashboardStatsDto;
import com.dormmanager.dto.DemandeHebergementDto;
import com.dormmanager.dto.ReclamationDto;
import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.Chambre;
import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Reclamation;
import com.dormmanager.entity.StatutDemande;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.repository.AffectationRepository;
import com.dormmanager.repository.ChambreRepository;
import com.dormmanager.repository.DemandeHebergementRepository;
import com.dormmanager.repository.ReclamationRepository;
import com.dormmanager.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dormmanager.services.NotificationService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GestionnaireService {

    private final DemandeHebergementRepository demandeHebergementRepository;
    private final ChambreRepository chambreRepository;
    private final AffectationRepository affectationRepository;
    private final ReclamationRepository reclamationRepository;
    private final NotificationService notificationService;
    private final UtilisateurRepository utilisateurRepository;

    public GestionnaireService(DemandeHebergementRepository demandeHebergementRepository,
                               ChambreRepository chambreRepository,
                               AffectationRepository affectationRepository,
                               ReclamationRepository reclamationRepository,
                               NotificationService notificationService,
                               UtilisateurRepository utilisateurRepository) {
        this.demandeHebergementRepository = demandeHebergementRepository;
        this.chambreRepository = chambreRepository;
        this.affectationRepository = affectationRepository;
        this.reclamationRepository = reclamationRepository;
        this.notificationService = notificationService;
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<DemandeHebergementDto> getDemandesEnAttente() {
        return demandeHebergementRepository
                .findByStatutOrderByDateSoumissionDesc(StatutDemande.EN_ATTENTE)
                .stream()
                .map(DemandeHebergementDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Get operational statistics for gestionnaire dashboard.
     * Returns only gestionnaire-specific operational stats:
     * - nbEtudiantsLoges: number of students with ACTIVE affectations TODAY
     *   (dateDebut <= today AND (dateFin IS NULL OR dateFin >= today))
     * - nbChambresDisponibles: number of available rooms
     * - nbDemandesEnAttente: number of pending housing requests
     * - nbReclamations: total number of complaints
     */
    public DashboardStatsDto getDashboardStats() {
        LocalDate today = LocalDate.now();
        
        // Count students with active affectations TODAY
        // An affectation is active if it started today or before AND ends today or in the future (or no end date)
        long nbEtudiantsLoges = affectationRepository.countDistinctEtudiantsLoges(today);

        // Count available rooms
        long nbChambresDisponibles = chambreRepository.countByEtatIgnoreCase("disponible");

        // Count pending requests
        long nbDemandesEnAttente = demandeHebergementRepository.countByStatut(StatutDemande.EN_ATTENTE);

        // Count all complaints
        long nbReclamations = reclamationRepository.count();

        // Return only gestionnaire-specific stats (other fields set to 0)
        return new DashboardStatsDto(
            nbEtudiantsLoges,
            nbChambresDisponibles,
            nbDemandesEnAttente,
            nbReclamations,
            0L,   // totalUtilisateurs (not for gestionnaire)
            0.0,  // percentageUtilisateursMois (not for gestionnaire)
            0L,   // totalChambres (not for gestionnaire)
            0.0,  // percentageChambresOccupees (not for gestionnaire)
            0L,   // totalDemandes (not for gestionnaire)
            0L,   // reclamationsEnAttente (not for gestionnaire)
            0L,   // etudiantsCount (not for gestionnaire)
            0L,   // gestionnairesCount (not for gestionnaire)
            0L,   // agentsTechniquesCount (not for gestionnaire)
            0L    // adminCount (not for gestionnaire)
        );
    }

    public List<Chambre> getChambresDisponibles() {
        return chambreRepository.findByEtatIgnoreCase("disponible");
    }

    public Chambre ajouterChambre(ChambreRequestDto dto) {
        Chambre chambre = new Chambre();
        chambre.setNumero(dto.getNumero());
        chambre.setType(dto.getType());
        if (dto.getCapacite() != null) {
            chambre.setCapacite(dto.getCapacite());
        }
        // etat par défaut = "disponible" si non fourni
        chambre.setEtat(dto.getEtat() == null || dto.getEtat().isBlank()
                ? "disponible"
                : dto.getEtat().toLowerCase());

        return chambreRepository.save(chambre);
    }

    public List<ReclamationDto> getDernieresReclamations() {
        return reclamationRepository.findTop10ByOrderByDateEnvoiDesc()
                .stream()
                .map(ReclamationDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Affecter une chambre à la demande et valider la demande.
     * - crée une Affectation
     * - passe la chambre en "occupee"
     * - change le statut de la demande en ACCEPTEE
     */
    public Affectation affecterEtValiderDemande(AffectationRequestDto dto) {
        DemandeHebergement demande = demandeHebergementRepository.findById(dto.getDemandeId())
                .orElseThrow(() -> new IllegalArgumentException("Demande introuvable: " + dto.getDemandeId()));

        Chambre chambre = chambreRepository.findById(dto.getChambreId())
                .orElseThrow(() -> new IllegalArgumentException("Chambre introuvable: " + dto.getChambreId()));

        if (!"disponible".equalsIgnoreCase(chambre.getEtat())) {
            throw new IllegalStateException("La chambre " + chambre.getNumero() + " n'est pas disponible");
        }

        Affectation affectation = new Affectation();
        affectation.setEtudiant(demande.getEtudiant());
        affectation.setChambre(chambre);

        LocalDate dateDebut = dto.getDateDebut() != null ? dto.getDateDebut() : LocalDate.now();
        affectation.setDateDebut(dateDebut);
        affectation.setDateFin(dto.getDateFin());
        affectation.setRemarque(dto.getRemarque());

        Affectation saved = affectationRepository.save(affectation);

        // Mettre à jour la chambre et la demande
        chambre.setEtat("occupee");
        chambreRepository.save(chambre);

        demande.setStatut(StatutDemande.VALIDEE);
        demandeHebergementRepository.save(demande);

        // Notify the student that their demande has been accepted
        notificationService.sendNotification(
            demande.getEtudiant(),
            "success",
            "Demande acceptée",
            "Votre demande d'hébergement a été acceptée"
        );

        // Notify the student of the new affectation
        String affectationMessage = "Vous avez été affecté à la chambre " + chambre.getNumero() + 
                " du " + dateDebut + " au " + dto.getDateFin();
        notificationService.sendNotification(
            demande.getEtudiant(),
            "success",
            "Nouvelle affectation",
            affectationMessage
        );

        // Notify all admins of the new affectation
        String studentName = demande.getEtudiant().getNom() + " " + demande.getEtudiant().getPrenom();
        notifyAdminsOnAffectation(chambre.getNumero(), studentName);

        return saved;
    }

    /**
     * Rejeter une demande sans création d'affectation.
     * Optionnellement, on peut garder le motif dans le champ motif.
     */
    public DemandeHebergement rejeterDemande(Long demandeId, String motifRejet) {
        DemandeHebergement demande = demandeHebergementRepository.findById(demandeId)
                .orElseThrow(() -> new IllegalArgumentException("Demande introuvable: " + demandeId));

        demande.setStatut(StatutDemande.REJETEE);
        if (motifRejet != null && !motifRejet.isBlank()) {
            demande.setMotif(motifRejet);
        }
        DemandeHebergement saved = demandeHebergementRepository.save(demande);

        // Notify the student that their demande has been rejected
        notificationService.sendNotification(
                demande.getEtudiant(),
                "warning",
                "Demande rejetée",
                "Votre demande d'hébergement a été rejetée"
        );

        return saved;
    }


    /**
     * Récupérer toutes les demandes d'hébergement.
     */
    public java.util.List<DemandeHebergement> getAllDemandes() {
        return demandeHebergementRepository.findAll();
    }

    /**
     * Valider une demande sans affectation explicite.
     * Utilisé par DemandeController (endpoint /{id}/valider).
     */
    public DemandeHebergement validerDemande(Long demandeId) {
        DemandeHebergement demande = demandeHebergementRepository.findById(demandeId)
                .orElseThrow(() -> new IllegalArgumentException("Demande introuvable: " + demandeId));
        demande.setStatut(StatutDemande.VALIDEE);
        DemandeHebergement saved = demandeHebergementRepository.save(demande);

        // Notify student
        notificationService.sendNotification(
            demande.getEtudiant(),
            "success",
            "Demande validée",
            "Votre demande d'hébergement a été validée"
        );

        return saved;
    }

    /**
     * Rejeter une demande sans motif (surcharge utilisée par DemandeController).
     */
    public DemandeHebergement rejeterDemande(Long demandeId) {
        return rejeterDemande(demandeId, null);
    }

    public List<Chambre> getChambresDisponibles(String type) {
    if (type == null || type.isEmpty()) {
        return chambreRepository.findByEtat("DISPONIBLE");
    }
    return chambreRepository.findByEtatAndType("DISPONIBLE", type);
}

    /**
     * Notify all admins that a new chambre has been added by gestionnaire
     */
    public void notifyAdminsOnChambreAdd(Chambre chambre) {
        String message = String.format("Le gestionnaire a ajouté une nouvelle chambre %s.", chambre.getNumero());
        notificationService.notifyAllAdmins("info", "Nouvelle chambre ajoutée", message);
    }

    /**
     * Notify based on who added the chambre (admin or gestionnaire).
     * If admin added it, notify all gestionnaires.
     * If gestionnaire added it, notify all admins.
     */
    public void notifyOnChambreAdd(Chambre chambre, Long userId) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getRole() == Utilisateur.Role.ADMIN) {
            // Admin added chambre -> notify gestionnaires
            String message = String.format("L'administrateur a ajouté une nouvelle chambre %s.", chambre.getNumero());
            notificationService.notifyAllGestionnaires("info", "Nouvelle chambre ajoutée", message);
        } else {
            // Gestionnaire added chambre -> notify admins
            String message = String.format("Le gestionnaire a ajouté une nouvelle chambre %s.", chambre.getNumero());
            notificationService.notifyAllAdmins("info", "Nouvelle chambre ajoutée", message);
        }
    }

    /**
     * Notify all admins that a new affectation has been created by gestionnaire
     */
    public void notifyAdminsOnAffectation(String chambreNumero, String etudiantNom) {
        String message = String.format("Le gestionnaire a attribué la chambre %s à %s.", chambreNumero, etudiantNom);
        notificationService.notifyAllAdmins("info", "Nouvelle affectation enregistrée", message);
    }
}