package com.dormmanager.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class DemandeHebergement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.DATE)
    private Date dateSoumission;

    private String motif;

    @Enumerated(EnumType.STRING)
    private StatutDemande statut;

    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    // --- Constructors ---
    public DemandeHebergement() {}

    public DemandeHebergement(Date dateSoumission, String motif, StatutDemande statut, Etudiant etudiant) {
        this.dateSoumission = dateSoumission;
        this.motif = motif;
        this.statut = statut;
        this.etudiant = etudiant;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public Date getDateSoumission() { return dateSoumission; }
    public void setDateSoumission(Date dateSoumission) { this.dateSoumission = dateSoumission; }
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    public StatutDemande getStatut() { return statut; }
    public void setStatut(StatutDemande statut) { this.statut = statut; }
    public Etudiant getEtudiant() { return etudiant; }
    public void setEtudiant(Etudiant etudiant) { this.etudiant = etudiant; }
}

