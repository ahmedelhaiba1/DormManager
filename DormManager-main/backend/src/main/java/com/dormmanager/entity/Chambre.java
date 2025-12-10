package com.dormmanager.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity
public class Chambre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numero;

    private String type; // simple, double...
    private String etat; // disponible, occupee, maintenance
    private int capacite = 1;

    @OneToMany(mappedBy = "chambre")
    private List<Affectation> affectations = new ArrayList<>();

    // Getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getEtat() { return etat; }
    public void setEtat(String etat) { this.etat = etat; }
    public int getCapacite() { return capacite; }
    public void setCapacite(int capacite) { this.capacite = capacite; }
    public List<Affectation> getAffectations() { return affectations; }
    public void setAffectations(List<Affectation> affectations) { this.affectations = affectations; }
}
