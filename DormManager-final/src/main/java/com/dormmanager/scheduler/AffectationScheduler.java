package com.dormmanager.scheduler;

import com.dormmanager.entity.Affectation;
import com.dormmanager.repository.AffectationRepository;
import com.dormmanager.repository.ChambreRepository;
import com.dormmanager.services.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduler pour gérer les affectations expirées.
 * Libère automatiquement les chambres quand la date de fin est atteinte.
 */
@Component
public class AffectationScheduler {

    private final AffectationRepository affectationRepo;
    private final ChambreRepository chambreRepo;
    private final NotificationService notificationService;

    public AffectationScheduler(AffectationRepository affectationRepo, ChambreRepository chambreRepo,
                                 NotificationService notificationService) {
        this.affectationRepo = affectationRepo;
        this.chambreRepo = chambreRepo;
        this.notificationService = notificationService;
    }

    /**
     * Runs daily at midnight to handle expired affectations.
     * 
     * LOGIC:
     * 1. Find ALL expired affectations (dateFin < today)
     * 2. For each expired affectation:
     *    a) If notification NOT YET SENT: Send notification to student that their affectation ended
     *    b) Mark notification as sent
     *    c) Check if there's a NEWER active affectation for the same room
     *       - If YES: Another student is now occupying this room → DON'T free it
     *       - If NO: Room is now empty → FREE it (set to disponible)
     * 
     * This ensures notifications are sent ONLY ONCE when the affectation expires,
     * not every time the scheduler runs.
     * 
     * Example:
     * - Student A: Chambre 5, 12/04-12/05 (EXPIRED on 12/06)
     * - Student B: Chambre 5, 12/05-12/20 (ACTIVE on 12/06)
     * - Scheduler finds Student A's expired affectation
     * - Checks: Has notification been sent? NO → Send it and mark as sent
     * - Checks: Is there an active affectation for Chambre 5? YES (Student B with 12/20)
     * - Decision: Keep room occupied (don't free it, because Student B uses it)
     */
    //@Scheduled(fixedDelay = 300000) // For testing: runs every 5 minutes
    @Scheduled(cron = "0 0 0 * * *") // Daily at midnight
    public void freeExpiredAffectations() {
        LocalDate today = LocalDate.now();
        System.out.println("🔵 [SCHEDULER] Checking for expired affectations (today: " + today + ")");
        
        // Find ALL expired affectations
        java.util.List<Affectation> allExpiredAffectations = affectationRepo.findExpiredOccupiedAffectations(today);
        System.out.println("🔵 [SCHEDULER] Found " + allExpiredAffectations.size() + " expired affectations");

        // Process each expired affectation
        for (Affectation expiredAff : allExpiredAffectations) {
            if (expiredAff.getChambre() == null) {
                System.out.println("⚠️  [SCHEDULER] Affectation " + expiredAff.getId() + " has no chambre, skipping");
                continue;
            }
            
            String chambreNumero = expiredAff.getChambre().getNumero();
            String studentEmail = expiredAff.getEtudiant() != null ? expiredAff.getEtudiant().getEmail() : "Unknown";
            
            System.out.println("🔵 [SCHEDULER] Processing expired affectation for " + studentEmail + " in Chambre " + chambreNumero + " (ended: " + expiredAff.getDateFin() + ")");
            
            // STEP 1: Only send notification if NOT already sent
            if (!expiredAff.isNotificationEnvoye() && expiredAff.getEtudiant() != null) {
                notificationService.sendNotification(
                    expiredAff.getEtudiant(),
                    "info",
                    "Affectation expirée",
                    "Votre période d'hébergement est arrivée à son terme."
                );
                // Mark notification as sent
                expiredAff.setNotificationEnvoye(true);
                affectationRepo.save(expiredAff);
                System.out.println("📧 [SCHEDULER] Notification sent to " + studentEmail);
            } else if (expiredAff.isNotificationEnvoye()) {
                System.out.println("✓ [SCHEDULER] Notification already sent to " + studentEmail + " (skipping duplicate)");
            }
            
            // STEP 2: Check if there's a NEWER active affectation for this room
            boolean hasNewerAffectation = affectationRepo.existsActiveAffectationForChambre(expiredAff.getChambre().getId(), today);
            
            if (!hasNewerAffectation) {
                // CASE 1: No newer affectation → Room is NOW EMPTY → FREE IT
                expiredAff.getChambre().setEtat("disponible");
                chambreRepo.save(expiredAff.getChambre());
                System.out.println("✅ [SCHEDULER] Chambre " + chambreNumero + " FREED and marked disponible (no newer affectation)");
            } else {
                // CASE 2: Newer affectation exists → Room is NOW OCCUPIED by another student → KEEP IT OCCUPIED
                System.out.println("⏭️  [SCHEDULER] Chambre " + chambreNumero + " KEPT occupied (newer active affectation exists - room re-assigned to another student)");
            }
        }

        if (!allExpiredAffectations.isEmpty()) {
            System.out.println("✅ [SCHEDULER] Finished processing " + allExpiredAffectations.size() + " expired affectation(s)");
        } else {
            System.out.println("✅ [SCHEDULER] No expired affectations to process");
        }
    }
}
