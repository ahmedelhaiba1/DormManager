package com.dormmanager.repository;

import com.dormmanager.entity.Affectation;
import com.dormmanager.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;


/**
 * Repository JPA pour les affectations.
 *
 * Remarque importante :
 * ---------------------
 * Pour récupérer l'affectation actuelle d'un étudiant, on travaille
 * désormais avec l'identifiant de l'étudiant plutôt qu'avec l'entité
 * complète. Cela évite tout problème de contexte de persistance ou
 * d'instance d'étudiant différente (par exemple un objet Étudiant
 * désérialisé à partir du token JWT).
 */

public interface AffectationRepository extends JpaRepository<Affectation, Long> {

    /**
     * Count distinct students who currently have an ACTIVE affectation (logés).
     * 
     * An affectation is ACTIVE (student is logé) if:
     * 1. dateDebut <= today (affectation has started)
     * 2. (dateFin IS NULL OR dateFin >= today) (affectation hasn't ended, or has no end date)
     * 
     * This represents students who are CURRENTLY living in the dorm TODAY.
     * 
     * Examples:
     * - Affectation: 12/01-12/15, today=12/10 → ACTIVE (logé)
     * - Affectation: 12/01-12/05, today=12/10 → INACTIVE (expired)
     * - Affectation: 12/15-12/30, today=12/10 → INACTIVE (not started yet)
     * - Affectation: 12/01-null, today=12/10 → ACTIVE (no end date)
     */
    @Query("SELECT COUNT(DISTINCT a.etudiant) FROM Affectation a " +
           "WHERE a.dateDebut <= :currentDate " +
           "AND (a.dateFin IS NULL OR a.dateFin >= :currentDate)")
    long countDistinctEtudiantsLoges(LocalDate currentDate);
    /**
     * Retourne la dernière affectation (la plus récente) pour un étudiant,
     * qu'elle soit en cours ou à venir.
     */
    Affectation findTopByEtudiantIdOrderByDateDebutDesc(Long etudiantId);

    /**
     * Vérifie si un étudiant a une affectation active.
     * 
     * An affectation is considered ACTIVE if:
     * 1. dateFin is NULL (no end date), OR
     * 2. dateFin is AFTER today (dateFin > currentDate)
     * 
     * An affectation is EXPIRED if:
     * - dateFin is on or before today (dateFin <= currentDate)
     * 
     * AND the room must be marked as occupied.
     * 
     * Note: Uses > (not >=) so if affectation ends today, it's considered expired.
     * This allows student to create a new demande on the day their affectation ends.
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Affectation a " +
           "WHERE a.etudiant.id = :etudiantId " +
           "AND (a.dateFin IS NULL OR a.dateFin > :currentDate) " +
           "AND a.chambre.etat = 'occupee'")
    boolean existsActiveAffectationByEtudiantId(Long etudiantId, LocalDate currentDate);

    /**
     * Find all affectations that have ENDED (dateFin is BEFORE today, strictly in the past)
     * and the room is still marked as occupied.
     * 
     * IMPORTANT: Uses < (not <=) because:
     * - If today is 12/05 and dateFin is 12/05, the student can still use the room today
     * - Only free the room when dateFin is strictly BEFORE today (12/04 or earlier)
     */
    @Query("SELECT a FROM Affectation a " +
           "WHERE a.dateFin IS NOT NULL " +
           "AND a.dateFin < :currentDate " +
           "AND a.chambre IS NOT NULL " +
           "AND a.chambre.etat = 'occupee'")
    List<Affectation> findExpiredOccupiedAffectations(LocalDate currentDate);

    /**
     * Find all TRULY expired affectations where there is NO newer active affectation
     * for the same chambre. This ensures we don't free a room that has been re-assigned
     * to a new student with a future date.
     * 
     * Logic:
     * 1. Find expired affectations (dateFin < today)
     * 2. For each chambre, verify there's no other affectation for the same chambre
     *    with dateFin >= today (which would mean the room is assigned to someone else)
     */
    @Query("SELECT a FROM Affectation a " +
           "WHERE a.dateFin IS NOT NULL " +
           "AND a.dateFin < :currentDate " +
           "AND a.chambre IS NOT NULL " +
           "AND a.chambre.etat = 'occupee' " +
           "AND NOT EXISTS (" +
           "  SELECT 1 FROM Affectation a2 " +
           "  WHERE a2.chambre.id = a.chambre.id " +
           "  AND (a2.dateFin IS NULL OR a2.dateFin >= :currentDate) " +
           "  AND a2.id != a.id" +
           ")")
    List<Affectation> findExpiredAffectationsWithoutNewerOnes(LocalDate currentDate);

    /**
     * Check if there is ANY active affectation for a given chambre
     * (i.e., an affectation that hasn't expired yet)
     */
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Affectation a " +
           "WHERE a.chambre.id = :chambreId " +
           "AND (a.dateFin IS NULL OR a.dateFin >= :currentDate)")
    boolean existsActiveAffectationForChambre(Long chambreId, LocalDate currentDate);

    /**
     * Delete all affectations for a given student (used when deleting a student account)
     */
    void deleteByEtudiantId(Long etudiantId);

}