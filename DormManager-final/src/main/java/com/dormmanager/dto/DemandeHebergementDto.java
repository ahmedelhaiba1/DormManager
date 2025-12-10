
package com.dormmanager.dto;

import com.dormmanager.entity.DemandeHebergement;
import com.dormmanager.entity.Etudiant;
import com.dormmanager.entity.StatutDemande;

import java.util.Date;

public class DemandeHebergementDto {

    private Long id;
    private Date dateSoumission;
    private String motif;
    private StatutDemande statut;

    private Long etudiantId;
    private String nom;
    private String prenom;
    private String matricule;
    private String filiere;
    private String email;

    public DemandeHebergementDto() {
    }

    public DemandeHebergementDto(DemandeHebergement demande) {
        this.id = demande.getId();
        this.dateSoumission = demande.getDateSoumission();
        this.motif = demande.getMotif();
        this.statut = demande.getStatut();

        Etudiant e = demande.getEtudiant();
        if (e != null) {
            this.etudiantId = e.getId();
            this.nom = e.getNom();
            this.prenom = e.getPrenom();
            this.matricule = e.getMatricule();
            this.filiere = e.getFiliere();
            this.email = e.getEmail();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDateSoumission() {
        return dateSoumission;
    }

    public void setDateSoumission(Date dateSoumission) {
        this.dateSoumission = dateSoumission;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public StatutDemande getStatut() {
        return statut;
    }

    public void setStatut(StatutDemande statut) {
        this.statut = statut;
    }

    public Long getEtudiantId() {
        return etudiantId;
    }

    public void setEtudiantId(Long etudiantId) {
        this.etudiantId = etudiantId;
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

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getFiliere() {
        return filiere;
    }

    public void setFiliere(String filiere) {
        this.filiere = filiere;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
