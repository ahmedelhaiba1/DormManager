package com.dormmanager.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class EtatDesLieux {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateEtat = LocalDate.now();
    private String etat;
    private String remarques;

    @ManyToOne(optional = false)
    private Affectation affectation;

    // Getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDateEtat() { return dateEtat; }
    public void setDateEtat(LocalDate dateEtat) { this.dateEtat = dateEtat; }
    public String getEtat() { return etat; }
    public void setEtat(String etat) { this.etat = etat; }
    public String getRemarques() { return remarques; }
    public void setRemarques(String remarques) { this.remarques = remarques; }
    public Affectation getAffectation() { return affectation; }
    public void setAffectation(Affectation affectation) { this.affectation = affectation; }
}
