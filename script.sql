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

INSERT INTO Entreprise
(nom, secteur_activite, nombre_employes, nombre_serveurs, nombre_postes_clients, services_exposes, gestion_vulnerabilites, risque_cyber)
VALUES
(
    'MediCare Solutions',
    'Santé',
    350,
    45,
    320,
    'Portail patient HTTPS, VPN, Messagerie Web',
    'Scan mensuel et correctifs trimestriels',
    'Élevé'
),
(
    'ShopFast',
    'E-commerce',
    120,
    25,
    110,
    'HTTPS, API REST, SMTP, VPN',
    'Scan hebdomadaire et patch mensuel',
    'Élevé'
),
(
    'IndusTech Manufacturing',
    'Industrie',
    900,
    80,
    750,
    'VPN fournisseurs, Portail RH',
    'Scan trimestriel',
    'Critique'
),
(
    'FinNova Bank',
    'Finance',
    1500,
    220,
    1300,
    'Banque en ligne, API bancaires, VPN',
    'Gestion continue des vulnérabilités',
    'Critique'
),
(
    'EduConnect',
    'Éducation',
    200,
    20,
    180,
    'Moodle, VPN, Messagerie',
    'Scan semestriel',
    'Moyen'
),
(
    'GreenEnergy Corp',
    'Énergie',
    700,
    65,
    620,
    'Portail partenaires, VPN',
    'Scan mensuel',
    'Critique'
),
(
    'TravelEasy',
    'Tourisme',
    80,
    10,
    70,
    'HTTPS, API réservation',
    'Correctifs manuels occasionnels',
    'Élevé'
),
(
    'LegalExpert',
    'Juridique',
    60,
    8,
    55,
    'VPN, Portail client',
    'Patchs trimestriels',
    'Élevé'
),
(
    'CloudWare',
    'Services informatiques',
    300,
    150,
    250,
    'API SaaS, VPN, Portail client',
    'Scan automatique hebdomadaire',
    'Moyen'
),
(
    'RetailPlus',
    'Grande distribution',
    500,
    35,
    450,
    'Site e-commerce, VPN magasins',
    'Scan mensuel',
    'Élevé'
);

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