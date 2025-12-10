package com.dormmanager.services;

import com.dormmanager.dto.DashboardStatsDto;
import com.dormmanager.dto.UpdateUtilisateurDto;
import com.dormmanager.entity.Administrateur;
import com.dormmanager.entity.AgentTechnique;
import com.dormmanager.entity.Chambre;
import com.dormmanager.entity.GestionnaireFoyer;
import com.dormmanager.entity.Utilisateur;
import com.dormmanager.repository.AffectationRepository;
import com.dormmanager.repository.ChambreRepository;
import com.dormmanager.repository.DemandeHebergementRepository;
import com.dormmanager.repository.NotificationRepository;
import com.dormmanager.repository.ReclamationRepository;
import com.dormmanager.repository.UtilisateurRepository;
import com.dormmanager.services.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@Transactional
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final ChambreRepository chambreRepository;
    private final AffectationRepository affectationRepository;
    private final DemandeHebergementRepository demandeHebergementRepository;
    private final ReclamationRepository reclamationRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    public AdminService(UtilisateurRepository utilisateurRepository,
                        ChambreRepository chambreRepository,
                        AffectationRepository affectationRepository,
                        DemandeHebergementRepository demandeHebergementRepository,
                        ReclamationRepository reclamationRepository,
                        NotificationRepository notificationRepository,
                        NotificationService notificationService) {
        this.utilisateurRepository = utilisateurRepository;
        this.chambreRepository = chambreRepository;
        this.affectationRepository = affectationRepository;
        this.demandeHebergementRepository = demandeHebergementRepository;
        this.reclamationRepository = reclamationRepository;
        this.notificationRepository = notificationRepository;
        this.notificationService = notificationService;
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public void deleteUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Delete notifications sent to this user (applies to all user types)
        notificationRepository.deleteByDestinataireId(id);
        
        // Delete reclamations associated with this user (applies to all user types)
        reclamationRepository.deleteByUtilisateurId(id);
        
        // If the user is an etudiant, delete student-specific related records
        if (utilisateur.getRole() == Utilisateur.Role.ETUDIANT) {
            // Delete affectations associated with this student
            affectationRepository.deleteByEtudiantId(id);
            
            // Delete demandes associated with this student
            demandeHebergementRepository.deleteByEtudiantId(id);
        }
        
        utilisateurRepository.deleteById(id);
    }

    public Utilisateur updateUtilisateur(Long id, UpdateUtilisateurDto dto) {
        Utilisateur existing = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        existing.setNom(dto.getNom());
        existing.setPrenom(dto.getPrenom());
        existing.setEmail(dto.getEmail());
        
        // Convert string role to enum
        if (dto.getRole() != null && !dto.getRole().isEmpty()) {
            try {
                existing.setRole(Utilisateur.Role.valueOf(dto.getRole()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Rôle invalide: " + dto.getRole());
            }
        }
        
        Utilisateur saved = utilisateurRepository.save(existing);
        
        // Notify the user that admin has modified their information
        String message = String.format("Votre profil a été modifié par l'administrateur. " +
                "Vos informations mises à jour: Nom: %s, Prénom: %s, Email: %s",
                dto.getNom(), dto.getPrenom(), dto.getEmail());
        notificationService.sendNotification(saved, "info", "Modification de profil", message);
        
        return saved;
    }

    /**
     * Create a new user (Gestionnaire, Agent Technique, or Admin)
     * Date de création is set automatically to today
     * Password is stored as provided
     */
    public Utilisateur createUtilisateur(String nom, String prenom, String email, String password, String role) {
        // Check if email already exists
        Utilisateur existing = utilisateurRepository.findByEmail(email);
        if (existing != null) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        Utilisateur user;
        
        // Create appropriate subclass based on role
        switch(role) {
            case "GESTIONNAIRE":
                user = new GestionnaireFoyer();
                break;
            case "AGENT_TECHNIQUE":
                user = new AgentTechnique();
                break;
            case "ADMIN":
                user = new Administrateur();
                break;
            default:
                throw new RuntimeException("Rôle invalide: " + role);
        }
        
        user.setNom(nom);
        user.setPrenom(prenom);
        user.setEmail(email);
        user.setMotDePasse(password);
        user.setRole(Utilisateur.Role.valueOf(role));
        user.setDateCreation(LocalDateTime.now());

        return utilisateurRepository.save(user);
    }

    /**
     * Get all chambres (for admin dashboard viewing all rooms regardless of status)
     */
    public List<Chambre> toutesLesChambres() {
        return chambreRepository.findAll();
    }

    /**
     * Get dashboard statistics for admin panel (total utilisateurs, total chambres, etc.)
     */
    public DashboardStatsDto getDashboardStats() {
        LocalDate today = LocalDate.now();
        
        // 1. Total students currently logés (active affectations)
        long nbEtudiantsLoges = affectationRepository.countDistinctEtudiantsLoges(today);
        
        // 2. Available rooms
        long nbChambresDisponibles = chambreRepository.countByEtatIgnoreCase("disponible");
        
        // 3. Housing requests waiting for decision
        long nbDemandesEnAttente = demandeHebergementRepository.countByStatut(com.dormmanager.entity.StatutDemande.EN_ATTENTE);
        
        // 4. Complaints waiting for resolution
        long nbReclamations = reclamationRepository.countByEnAttenteOrNull();
        
        // 5. Total users in system
        long totalUtilisateurs = utilisateurRepository.count();
        
        // 6. Month-over-month user change (%)
        double percentageUtilisateursMois = calculateUserGrowthPercentage();
        
        // 7. Total rooms in database
        long totalChambres = chambreRepository.count();
        
        // 8. Percentage of occupied rooms
        double percentageChambresOccupees = totalChambres > 0 
            ? ((double)(totalChambres - nbChambresDisponibles) / totalChambres) * 100 
            : 0.0;
        
        // 9. Total housing requests (all statuses)
        long totalDemandes = demandeHebergementRepository.count();
        
        // 10. Complaints waiting for resolution
        long reclamationsEnAttente = reclamationRepository.countByEnAttenteOrNull();
        
        // 11-14. Count users by role
        long etudiantsCount = utilisateurRepository.countByRole(Utilisateur.Role.ETUDIANT);
        long gestionnairesCount = utilisateurRepository.countByRole(Utilisateur.Role.GESTIONNAIRE);
        long agentsTechniquesCount = utilisateurRepository.countByRole(Utilisateur.Role.AGENT_TECHNIQUE);
        long adminCount = utilisateurRepository.countByRole(Utilisateur.Role.ADMIN);

        return new DashboardStatsDto(
                nbEtudiantsLoges,
                nbChambresDisponibles,
                nbDemandesEnAttente,
                nbReclamations,
                totalUtilisateurs,
                percentageUtilisateursMois,
                totalChambres,
                percentageChambresOccupees,
                totalDemandes,
                reclamationsEnAttente,
                etudiantsCount,
                gestionnairesCount,
                agentsTechniquesCount,
                adminCount
        );
    }
    
    /**
     * Calculate the percentage change in users from last month to this month.
     * Formula: ((Current month users - Previous month users) / Previous month users) * 100
     */
    private double calculateUserGrowthPercentage() {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth previousMonth = currentMonth.minusMonths(1);
        
        // Count users created in current month
        LocalDateTime currentMonthStart = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime currentMonthEnd = currentMonth.atEndOfMonth().atTime(23, 59, 59);
        long currentMonthUsers = utilisateurRepository.countByDateCreationBetween(currentMonthStart, currentMonthEnd);
        
        // Count users created in previous month
        LocalDateTime previousMonthStart = previousMonth.atDay(1).atStartOfDay();
        LocalDateTime previousMonthEnd = previousMonth.atEndOfMonth().atTime(23, 59, 59);
        long previousMonthUsers = utilisateurRepository.countByDateCreationBetween(previousMonthStart, previousMonthEnd);
        
        // Calculate percentage change
        if (previousMonthUsers == 0) {
            return currentMonthUsers > 0 ? 100.0 : 0.0;
        }
        
        return ((double)(currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100.0;
    }

    /**
     * Notify all gestionnaires that a chambre has been updated by admin
     */
    public void notifyGestionnairesOnChambreUpdate(Chambre chambre) {
        String message = String.format("L'administrateur a modifié la chambre %s.", chambre.getNumero());
        notificationService.notifyAllGestionnaires("info", "Mise à jour d'une chambre", message);
    }

    /**
     * Notify all gestionnaires that a chambre has been deleted by admin
     */
    public void notifyGestionnairesOnChambreDelete(String chambreNumero) {
        String message = String.format("La chambre %s a été supprimée par l'administrateur.", chambreNumero);
        notificationService.notifyAllGestionnaires("alert", "Suppression d'une chambre", message);
    }
}
