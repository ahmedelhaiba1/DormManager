package com.dormmanager.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Affectation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Etudiant etudiant;

    @ManyToOne(optional = false)
    private Chambre chambre;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    
    private String remarque;
    
    // Track if expiration notification has already been sent
    private boolean notificationEnvoye = false;


    // Getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Etudiant getEtudiant() { return etudiant; }
    public void setEtudiant(Etudiant etudiant) { this.etudiant = etudiant; }
    public Chambre getChambre() { return chambre; }
    public void setChambre(Chambre chambre) { this.chambre = chambre; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public String getRemarque() { return remarque; }
    public void setRemarque(String remarque) { this.remarque = remarque; }
    public boolean isNotificationEnvoye() { return notificationEnvoye; }
    public void setNotificationEnvoye(boolean notificationEnvoye) { this.notificationEnvoye = notificationEnvoye; }
}
