package com.dormmanager.entity;

import jakarta.persistence.Entity;

@Entity
public class GestionnaireFoyer extends Utilisateur {
    private String service;
    private String bureau;

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public String getBureau() { return bureau; }
    public void setBureau(String bureau) { this.bureau = bureau; }
}
