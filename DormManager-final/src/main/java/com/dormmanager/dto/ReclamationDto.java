
package com.dormmanager.dto;

import com.dormmanager.entity.Reclamation;
import com.dormmanager.entity.Utilisateur;

import java.time.LocalDate;

public class ReclamationDto {

    private Long id;
    private String message;
    private LocalDate dateEnvoi;
    private String status;

    private Long utilisateurId;
    private String nom;
    private String prenom;
    private String email;

    public ReclamationDto() {
    }

    public ReclamationDto(Reclamation reclamation) {
        this.id = reclamation.getId();
        this.message = reclamation.getMessage();
        this.dateEnvoi = reclamation.getDateEnvoi();
        this.status = reclamation.getStatus() != null ? reclamation.getStatus().toString() : "EN_ATTENTE";

        Utilisateur u = reclamation.getUtilisateur();
        if (u != null) {
            this.utilisateurId = u.getId();
            this.nom = u.getNom();
            this.prenom = u.getPrenom();
            this.email = u.getEmail();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDate getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(LocalDate dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Convenience for frontend: full name of the user who submitted the reclamation
    public String getEtudiantNomComplet() {
        if (prenom == null && nom == null) return null;
        if (prenom == null) return nom;
        if (nom == null) return prenom;
        return prenom + " " + nom;
    }
}
