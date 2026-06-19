CREATE TABLE Entreprise(
   id_entreprise INT AUTO_INCREMENT,
   nom VARCHAR(50) not null,
   secteur_activite VARCHAR(50),
   nombre_employes INT,
   nombre_serveurs INT,
   nombre_postes_clients INT,
   actifs TEXT,
   services_exposes TEXT,
   gestion_vulnerabilites TEXT,
   risque_cyber TEXT,
   PRIMARY KEY(id_entreprise)
);

INSERT INTO Entreprise
(nom, secteur_activite, nombre_employes, nombre_serveurs, nombre_postes_clients, actifs, services_exposes, gestion_vulnerabilites, risque_cyber)
VALUES
(
    'MediCare Solutions',
    'Santé',
    350,
    45,
    320,
    'Dossiers médicaux, ERP, Bases de données patients',
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
    'Base clients, Site marchand, ERP, Serveur de paiement',
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
    'ERP, Automates industriels, Active Directory',
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
    'Données bancaires, Applications métiers, SIEM',
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
    'Plateforme e-learning, Comptes étudiants',
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
    'SCADA, ERP, Données techniques',
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
    'CRM clients, Site de réservation',
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
    'GED, Documents confidentiels',
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
    'Infrastructure cloud, Machines virtuelles, Bases clients',
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
    'ERP, Bases clients, Caisses connectées',
    'Site e-commerce, VPN magasins',
    'Scan mensuel',
    'Élevé'
);