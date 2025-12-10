package com.dormmanager.dto;

import java.time.LocalDateTime;

public class NotificationDTO {

    public Long id;
    public String type;
    public String titre;
    public String message;
    public LocalDateTime date;
    public boolean lu;

    public NotificationDTO(Long id, String type, String titre, String message, LocalDateTime date, boolean lu) {
        this.id = id;
        this.type = type;
        this.titre = titre;
        this.message = message;
        this.date = date;
        this.lu = lu;
    }
}
