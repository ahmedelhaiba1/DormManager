/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dormmanager.repository;

/**
 *
 * @author User
 */
import com.dormmanager.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Utilisateur findByEmail(String email);
    java.util.List<Utilisateur> findByRole(Utilisateur.Role role);
    
    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.dateCreation >= :startDate AND u.dateCreation < :endDate")
    long countByDateCreationBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(u) FROM Utilisateur u WHERE u.role = :role")
    long countByRole(@Param("role") Utilisateur.Role role);
}
