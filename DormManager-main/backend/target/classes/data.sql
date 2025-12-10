-- ========== UTILISATEURS ==========
INSERT INTO utilisateur (id, nom, prenom, email, mot_de_passe, role)
VALUES
(1, 'Admin', 'Principal', 'admin@uiz.ac.ma', 'admin123', 'ADMIN'),
(2, 'Ait Houssa', 'Yasmine', 'yasmine@uiz.ac.ma', 'etudiant123', 'ETUDIANT'),
(3, 'El Idrissi', 'Hassan', 'hassan@uiz.ac.ma', 'gestion123', 'GESTIONNAIRE'),
(4, 'Boulouiz', 'Fatima', 'fatima@uiz.ac.ma', 'agent123', 'AGENT_TECHNIQUE');

-- ========== ADMINISTRATEUR ==========
INSERT INTO administrateur (id, niveau)
VALUES (1, 'Super Admin');

-- ========== GESTIONNAIRE ==========
INSERT INTO gestionnaire_foyer (id, bureau, service)
VALUES (3, 'Bloc A', 'Gestion des demandes');

-- ========== AGENT TECHNIQUE ==========
INSERT INTO agent_technique (id, specialite)
VALUES (4, 'Maintenance électrique');

-- ========== ETUDIANT ==========
INSERT INTO etudiant (id, matricule, filiere)
VALUES (2, 'MAT2025', 'Informatique');

-- ========== CHAMBRES ==========
INSERT INTO chambre (id, numero, type, capacite, etat)
VALUES
(1, 'A101', 'SIMPLE', 1, 'DISPONIBLE'),
(2, 'A102', 'DOUBLE', 2, 'DISPONIBLE'),
(3, 'A103', 'SIMPLE', 1, 'OCCUPEE');

-- ========== DEMANDES D’HÉBERGEMENT ==========
INSERT INTO demande_hebergement (id, date_soumission, etudiant_id, motif, statut)
VALUES
(1, '2025-11-01', 2, 'Besoin de logement universitaire', 'EN_ATTENTE');

-- ========== AFFECTATIONS ==========
INSERT INTO affectation (id, chambre_id, etudiant_id, date_debut, date_fin, remarque)
VALUES
(1, 3, 2, '2025-11-05', '2026-06-30', 'Affectation initiale');

-- ========== ETAT DES LIEUX ==========
INSERT INTO etat_des_lieux (id, affectation_id, date_etat, etat, remarques)
VALUES
(1, 1, '2025-11-05', 'Bon', 'Tout est en ordre');

-- ========== INCIDENTS ==========
INSERT INTO incident (id, chambre_id, description, statut, date_signalement)
VALUES
(1, 3, 'Fuite au lavabo', 'OUVERT', '2025-11-08');

-- ========== RÉCLAMATIONS ==========
INSERT INTO reclamation (id, utilisateur_id, message, date_envoi)
VALUES
(1, 2, 'Le chauffage ne fonctionne pas.', '2025-11-08');

-- ========== NOTIFICATIONS ==========
INSERT INTO notification (id, destinataire_id, message, date)
VALUES
(1, 2, 'Votre demande d’hébergement est en cours de traitement.', NOW());
