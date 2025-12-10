package com.dormmanager.entity;

import jakarta.persistence.Entity;

@Entity
public class AgentTechnique extends Utilisateur {
    private String specialite;

    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }
}
