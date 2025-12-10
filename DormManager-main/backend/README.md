# DormManager (Backend)

Projet conforme au cahier des charges: gestion des chambres d'un foyer universitaire.

## Lancer
1. Installe MySQL et crée un utilisateur (par défaut `root` sans mot de passe).
2. `mvn spring-boot:run` (Java 17+).  
   La base `dormmanager_db` se génère automatiquement (ddl-auto=create).

## Endpoints exemples
- `GET /api/chambres`
- `POST /api/chambres`
- `GET /api/demandes`
- `POST /api/demandes`

## Modèle
- Utilisateur (abstraite) ← Etudiant, GestionnaireFoyer, AgentTechnique, Administrateur
- Chambre, DemandeHebergement, Affectation, EtatDesLieux, Incident, Notification
