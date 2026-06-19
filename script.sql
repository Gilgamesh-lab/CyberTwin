DROP TABLE IF EXISTS vulnerabilite;
DROP TABLE IF EXISTS actifs;
DROP TABLE IF exists Entreprise;


CREATE TABLE Entreprise(
   id_entreprise INT AUTO_INCREMENT,
   nom VARCHAR(50) not null,
   secteur_activite VARCHAR(50),
   nombre_employes INT,
   nombre_serveurs INT,
   nombre_postes_clients INT,
   services_exposes TEXT,
   gestion_vulnerabilites TEXT,
   risque_cyber TEXT,
   PRIMARY KEY(id_entreprise)
);

CREATE TABLE actifs (
    id_actif INT AUTO_INCREMENT,
    id_entreprise INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    criticite ENUM('Faible','Moyenne','Élevée','Critique'),
    exposition_internet BOOLEAN DEFAULT false,
    PRIMARY KEY(id_actif),
    FOREIGN KEY (id_entreprise) REFERENCES Entreprise(id_entreprise)
);

CREATE TABLE vulnerabilite (
    id_vulnerabilite INT AUTO_INCREMENT PRIMARY KEY,
    id_actif INT NOT NULL,
    cve VARCHAR(50),
    description TEXT,
    score_cvss DECIMAL(3,1),
    statut ENUM('Ouverte','En cours','Corrigée'),
    date_detection DATE,
    FOREIGN KEY (id_actif) REFERENCES actifs(id_actif)
    
);

INSERT INTO Entreprise (nom, secteur_activite, nombre_employes, nombre_serveurs, nombre_postes_clients, services_exposes, gestion_vulnerabilites, risque_cyber) VALUES
('MediCare Solutions', 'Santé',350, 45, 320, 'Portail patient HTTPS, VPN, Messagerie Web', 'Scan mensuel et correctifs trimestriels','Élevé'),
('ShopFast', 'E-commerce', 120, 25, 110, 'HTTPS, API REST, SMTP, VPN', 'Scan hebdomadaire et patch mensuel', 'Élevé'),
('IndusTech Manufacturing', 'Industrie', 900, 80, 750, 'VPN fournisseurs, Portail RH', 'Scan trimestriel', 'Critique'),
('FinNova Bank', 'Finance', 1500, 220, 1300, 'Banque en ligne, API bancaires, VPN', 'Gestion continue des vulnérabilités','Critique'),
('EduConnect', 'Éducation', 200, 20, 180, 'Moodle, VPN, Messagerie', 'Scan semestriel','Moyen'),
('GreenEnergy Corp', 'Énergie', 700, 65, 620, 'Portail partenaires, VPN', 'Scan mensuel', 'Critique'),
('TravelEasy', 'Tourisme', 80, 10, 70, 'HTTPS, API réservation', 'Correctifs manuels occasionnels','Élevé'),
('LegalExpert', 'Juridique', 60, 8, 55, 'VPN, Portail client', 'Patchs trimestriels', 'Élevé'),
('CloudWare', 'Services informatiques', 300, 150, 250, 'API SaaS, VPN, Portail client', 'Scan automatique hebdomadaire', 'Moyen'),
('RetailPlus', 'Grande distribution', 500, 35, 450, 'Site e-commerce, VPN magasins', 'Scan mensuel','Élevé');

INSERT INTO actifs (id_entreprise, nom, type, criticite, exposition_internet) VALUES

-- MediCare Solutions (1)
(1, 'Dossiers médicaux', 'Données', 'Critique', FALSE),
(1, 'ERP', 'Application', 'Élevée', FALSE),
(1, 'Base de données patients', 'Base de données', 'Critique', FALSE),

-- ShopFast (2)
(2, 'Base clients', 'Base de données', 'Critique', FALSE),
(2, 'Site marchand', 'Application Web', 'Critique', TRUE),
(2, 'ERP', 'Application', 'Élevée', FALSE),
(2, 'Serveur de paiement', 'Serveur', 'Critique', TRUE),

-- IndusTech Manufacturing (3)
(3, 'ERP', 'Application', 'Élevée', FALSE),
(3, 'Automates industriels', 'OT/Industriel', 'Critique', FALSE),
(3, 'Active Directory', 'Service', 'Critique', FALSE),

-- FinNova Bank (4)
(4, 'Données bancaires', 'Données', 'Critique', FALSE),
(4, 'Applications métiers', 'Application', 'Critique', FALSE),
(4, 'SIEM', 'Sécurité', 'Élevée', FALSE),

-- EduConnect (5)
(5, 'Plateforme e-learning', 'Application Web', 'Élevée', TRUE),
(5, 'Comptes étudiants', 'Données', 'Moyenne', FALSE),

-- GreenEnergy Corp (6)
(6, 'SCADA', 'OT/Industriel', 'Critique', FALSE),
(6, 'ERP', 'Application', 'Élevée', FALSE),
(6, 'Données techniques', 'Données', 'Élevée', FALSE),

-- TravelEasy (7)
(7, 'CRM clients', 'Application', 'Élevée', FALSE),
(7, 'Site de réservation', 'Application Web', 'Critique', TRUE),

-- LegalExpert (8)
(8, 'GED', 'Application', 'Élevée', FALSE),
(8, 'Documents confidentiels', 'Données', 'Critique', FALSE),

-- CloudWare (9)
(9, 'Infrastructure cloud', 'Infrastructure', 'Critique', TRUE),
(9, 'Machines virtuelles', 'Infrastructure', 'Élevée', FALSE),
(9, 'Bases clients', 'Base de données', 'Critique', FALSE),

-- RetailPlus (10)
(10, 'ERP', 'Application', 'Élevée', FALSE),
(10, 'Bases clients', 'Base de données', 'Critique', FALSE),
(10, 'Caisses connectées', 'Équipement', 'Élevée', TRUE);

INSERT INTO vulnerabilite (id_actif, cve, description, score_cvss, statut, date_detection)VALUES

-- Asset 1 : Dossiers médicaux
(1, 'CVE-2025-1001', 'Accès non autorisé aux données médicales', 9.1, 'Ouverte', '2026-05-10'),

-- Asset 2 : ERP
(2, 'CVE-2025-1002', 'Injection SQL sur module ERP', 8.2, 'En cours', '2026-04-15'),

-- Asset 3 : Base de données patients
(3, 'CVE-2025-1003', 'Privilèges excessifs sur la base', 7.8, 'Ouverte', '2026-05-01'),

-- Asset 4 : Base clients
(4, 'CVE-2025-1004', 'Exposition de données personnelles', 8.7, 'Ouverte', '2026-05-20'),

-- Asset 5 : Site marchand
(5, 'CVE-2025-1005', 'Cross Site Scripting', 6.5, 'En cours', '2026-04-30'),
(5, 'CVE-2025-1006', 'Exécution de code à distance', 9.8, 'Ouverte', '2026-05-18'),

-- Asset 6 : ERP
(6, 'CVE-2025-1007', 'Authentification faible', 6.8, 'Corrigée', '2026-03-01'),

-- Asset 7 : Serveur de paiement
(7, 'CVE-2025-1008', 'Vulnérabilité TLS', 8.9, 'Ouverte', '2026-05-22'),

-- Asset 8 : ERP
(8, 'CVE-2025-1009', 'Comptes par défaut actifs', 6.4, 'En cours', '2026-04-12'),

-- Asset 9 : Automates industriels
(9, 'CVE-2025-1010', 'Commande distante non authentifiée', 9.5, 'Ouverte', '2026-05-25'),

-- Asset 10 : Active Directory
(10, 'CVE-2025-1011', 'Escalade de privilèges', 8.8, 'Ouverte', '2026-05-14'),

-- Asset 11 : Données bancaires
(11, 'CVE-2025-1012', 'Chiffrement faible', 7.9, 'En cours', '2026-05-03'),

-- Asset 12 : Applications métiers
(12, 'CVE-2025-1013', 'Injection SQL', 8.5, 'Ouverte', '2026-05-17'),

-- Asset 13 : SIEM
(13, 'CVE-2025-1014', 'Exposition API administration', 7.1, 'En cours', '2026-04-25'),

-- Asset 14 : Plateforme e-learning
(14, 'CVE-2025-1015', 'Upload de fichiers arbitraires', 8.0, 'Ouverte', '2026-05-21'),

-- Asset 15 : Comptes étudiants
(15, 'CVE-2025-1016', 'Politique de mot de passe faible', 5.5, 'En cours', '2026-04-20'),

-- Asset 16 : SCADA
(16, 'CVE-2025-1017', 'Accès distant non sécurisé', 9.6, 'Ouverte', '2026-05-28'),

-- Asset 17 : ERP
(17, 'CVE-2025-1018', 'Bibliothèque obsolète', 6.9, 'En cours', '2026-04-10'),

-- Asset 18 : Données techniques
(18, 'CVE-2025-1019', 'Partage réseau mal configuré', 6.3, 'Ouverte', '2026-05-06'),

-- Asset 19 : CRM clients
(19, 'CVE-2025-1020', 'Session non sécurisée', 7.4, 'En cours', '2026-05-11'),

-- Asset 20 : Site de réservation
(20, 'CVE-2025-1021', 'Injection SQL critique', 9.2, 'Ouverte', '2026-05-23'),

-- Asset 21 : GED
(21, 'CVE-2025-1022', 'Contrôle d’accès insuffisant', 7.2, 'Ouverte', '2026-05-09'),

-- Asset 22 : Documents confidentiels
(22, 'CVE-2025-1023', 'Données sensibles non chiffrées', 8.4, 'En cours', '2026-05-13'),

-- Asset 23 : Infrastructure cloud
(23, 'CVE-2025-1024', 'Bucket public exposé', 9.0, 'Ouverte', '2026-05-19'),

-- Asset 24 : Machines virtuelles
(24, 'CVE-2025-1025', 'Hyperviseur non patché', 8.1, 'En cours', '2026-05-08'),

-- Asset 25 : Bases clients
(25, 'CVE-2025-1026', 'Accès anonyme autorisé', 8.3, 'Ouverte', '2026-05-16'),

-- Asset 26 : ERP
(26, 'CVE-2025-1027', 'Faille d’authentification', 7.6, 'En cours', '2026-04-28'),

-- Asset 27 : Caisses connectées
(27, 'CVE-2025-1028', 'Communication non chiffrée', 8.0, 'Ouverte', '2026-05-27');