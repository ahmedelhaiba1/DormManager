package com.dormmanager.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Incident {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String statut = "OUVERT";
    private LocalDate dateSignalement = LocalDate.now();

    @ManyToOne(optional = false)
    private Chambre chambre;

    @ManyToOne
    private AgentTechnique agentAssigne;

    // Getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public LocalDate getDateSignalement() { return dateSignalement; }
    public void setDateSignalement(LocalDate dateSignalement) { this.dateSignalement = dateSignalement; }
    public Chambre getChambre() { return chambre; }
    public void setChambre(Chambre chambre) { this.chambre = chambre; }
    public AgentTechnique getAgentAssigne() { return agentAssigne; }
    public void setAgentAssigne(AgentTechnique agentAssigne) { this.agentAssigne = agentAssigne; }
}
