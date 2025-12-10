package com.dormmanager.entity;

import jakarta.persistence.Entity;

@Entity
public class Administrateur extends Utilisateur {
    private String niveau;

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }
}
