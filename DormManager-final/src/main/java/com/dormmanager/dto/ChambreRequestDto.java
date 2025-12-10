package com.dormmanager.dto;

public class ChambreRequestDto {

    private String numero;
    private String type;
    private Integer capacite;
    private String etat; // optionnel, "disponible" par défaut dans le service
    private Long userId; // user ID to determine if admin or gestionnaire is adding

    public ChambreRequestDto() {
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCapacite() {
        return capacite;
    }

    public void setCapacite(Integer capacite) {
        this.capacite = capacite;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
