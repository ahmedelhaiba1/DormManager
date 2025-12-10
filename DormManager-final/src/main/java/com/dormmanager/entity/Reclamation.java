/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dormmanager.entity;

/**
 *
 * @author User
 */
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private LocalDate dateEnvoi = LocalDate.now();

    @ManyToOne(optional = false)
    private Utilisateur utilisateur;

    public enum StatutReclamation {
        EN_ATTENTE, EN_COURS, RESOLUE
    }

    @Enumerated(EnumType.STRING)
    private StatutReclamation status = StatutReclamation.EN_ATTENTE;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDate getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(LocalDate dateEnvoi) { this.dateEnvoi = dateEnvoi; }
    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) { this.utilisateur = utilisateur; }
    public StatutReclamation getStatus() { return status; }
    public void setStatus(StatutReclamation status) { this.status = status; }
}

