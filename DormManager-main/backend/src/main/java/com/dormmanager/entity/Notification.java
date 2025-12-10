package com.dormmanager.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne(optional = false)
    private Utilisateur destinataire;

    // Getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public Utilisateur getDestinataire() { return destinataire; }
    public void setDestinataire(Utilisateur destinataire) { this.destinataire = destinataire; }
}
