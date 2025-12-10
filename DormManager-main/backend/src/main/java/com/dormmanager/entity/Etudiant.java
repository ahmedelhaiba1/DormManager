package com.dormmanager.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Etudiant extends Utilisateur {

    @Column(unique = true, nullable = false)
    private String matricule;

    private String filiere;

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }
}
