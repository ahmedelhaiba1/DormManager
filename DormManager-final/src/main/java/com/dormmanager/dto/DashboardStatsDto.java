package com.dormmanager.dto;

public class DashboardStatsDto {

    private long nbEtudiantsLoges;
    private long nbChambresDisponibles;
    private long nbDemandesEnAttente;
    private long nbReclamations;
    private long totalUtilisateurs;           // New: Total users in system
    private double percentageUtilisateursMois; // New: Month-over-month user change %
    private long totalChambres;                // New: Total rooms in database
    private double percentageChambresOccupees; // New: Percentage of occupied rooms
    private long totalDemandes;                // New: Total housing requests (all statuses)
    private long reclamationsEnAttente;        // New: Complaints waiting for resolution (replaces satisfaction)
    private long etudiantsCount;               // New: Count of ETUDIANT role users
    private long gestionnairesCount;           // New: Count of GESTIONNAIRE role users
    private long agentsTechniquesCount;        // New: Count of AGENT_TECHNIQUE role users
    private long adminCount;                   // New: Count of ADMIN role users

    public DashboardStatsDto() {}

    public DashboardStatsDto(long nbEtudiantsLoges, long nbChambresDisponibles,
                             long nbDemandesEnAttente, long nbReclamations,
                             long totalUtilisateurs, double percentageUtilisateursMois,
                             long totalChambres, double percentageChambresOccupees,
                             long totalDemandes, long reclamationsEnAttente,
                             long etudiantsCount, long gestionnairesCount,
                             long agentsTechniquesCount, long adminCount) {
        this.nbEtudiantsLoges = nbEtudiantsLoges;
        this.nbChambresDisponibles = nbChambresDisponibles;
        this.nbDemandesEnAttente = nbDemandesEnAttente;
        this.nbReclamations = nbReclamations;
        this.totalUtilisateurs = totalUtilisateurs;
        this.percentageUtilisateursMois = percentageUtilisateursMois;
        this.totalChambres = totalChambres;
        this.percentageChambresOccupees = percentageChambresOccupees;
        this.totalDemandes = totalDemandes;
        this.reclamationsEnAttente = reclamationsEnAttente;
        this.etudiantsCount = etudiantsCount;
        this.gestionnairesCount = gestionnairesCount;
        this.agentsTechniquesCount = agentsTechniquesCount;
        this.adminCount = adminCount;
    }

    // Getters and Setters
    public long getNbEtudiantsLoges() {
        return nbEtudiantsLoges;
    }

    public void setNbEtudiantsLoges(long nbEtudiantsLoges) {
        this.nbEtudiantsLoges = nbEtudiantsLoges;
    }

    public long getNbChambresDisponibles() {
        return nbChambresDisponibles;
    }

    public void setNbChambresDisponibles(long nbChambresDisponibles) {
        this.nbChambresDisponibles = nbChambresDisponibles;
    }

    public long getNbDemandesEnAttente() {
        return nbDemandesEnAttente;
    }

    public void setNbDemandesEnAttente(long nbDemandesEnAttente) {
        this.nbDemandesEnAttente = nbDemandesEnAttente;
    }

    public long getNbReclamations() {
        return nbReclamations;
    }

    public void setNbReclamations(long nbReclamations) {
        this.nbReclamations = nbReclamations;
    }

    public long getTotalUtilisateurs() {
        return totalUtilisateurs;
    }

    public void setTotalUtilisateurs(long totalUtilisateurs) {
        this.totalUtilisateurs = totalUtilisateurs;
    }

    public double getPercentageUtilisateursMois() {
        return percentageUtilisateursMois;
    }

    public void setPercentageUtilisateursMois(double percentageUtilisateursMois) {
        this.percentageUtilisateursMois = percentageUtilisateursMois;
    }

    public long getTotalChambres() {
        return totalChambres;
    }

    public void setTotalChambres(long totalChambres) {
        this.totalChambres = totalChambres;
    }

    public double getPercentageChambresOccupees() {
        return percentageChambresOccupees;
    }

    public void setPercentageChambresOccupees(double percentageChambresOccupees) {
        this.percentageChambresOccupees = percentageChambresOccupees;
    }

    public long getTotalDemandes() {
        return totalDemandes;
    }

    public void setTotalDemandes(long totalDemandes) {
        this.totalDemandes = totalDemandes;
    }

    public long getReclamationsEnAttente() {
        return reclamationsEnAttente;
    }

    public void setReclamationsEnAttente(long reclamationsEnAttente) {
        this.reclamationsEnAttente = reclamationsEnAttente;
    }

    public long getEtudiantsCount() {
        return etudiantsCount;
    }

    public void setEtudiantsCount(long etudiantsCount) {
        this.etudiantsCount = etudiantsCount;
    }

    public long getGestionnairesCount() {
        return gestionnairesCount;
    }

    public void setGestionnairesCount(long gestionnairesCount) {
        this.gestionnairesCount = gestionnairesCount;
    }

    public long getAgentsTechniquesCount() {
        return agentsTechniquesCount;
    }

    public void setAgentsTechniquesCount(long agentsTechniquesCount) {
        this.agentsTechniquesCount = agentsTechniquesCount;
    }

    public long getAdminCount() {
        return adminCount;
    }

    public void setAdminCount(long adminCount) {
        this.adminCount = adminCount;
    }
}
