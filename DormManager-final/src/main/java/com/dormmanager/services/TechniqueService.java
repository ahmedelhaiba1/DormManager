package com.dormmanager.services;

import org.springframework.stereotype.Service;

@Service
public class TechniqueService {

    // Placeholder methods to match deployment diagram.
    // You can later connect these to Incident and EtatDesLieux entities/repositories.

    public String resoudreIncident(Long incidentId) {
        // TODO: implement incident resolution logic
        return "Incident " + incidentId + " résolu (simulation)";
    }

    public String faireEtatDesLieux(Long chambreId) {
        // TODO: implement etat des lieux logic
        return "Etat des lieux pour la chambre " + chambreId + " effectué (simulation)";
    }
}
