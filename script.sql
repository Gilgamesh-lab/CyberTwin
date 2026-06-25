DROP TABLE IF EXISTS vulnerabilite;
DROP TABLE IF EXISTS actifs;
DROP TABLE IF EXISTS Entreprise;

CREATE TABLE Entreprise(
   id_entreprise INT AUTO_INCREMENT,
   name VARCHAR(50) NOT NULL,
   sector VARCHAR(50),
   employees INT,
   servers INT,
   workstations INT,
   exposedServices TEXT,
   PRIMARY KEY(id_entreprise)
);

CREATE TABLE actifs (
    id_actif INT AUTO_INCREMENT,
    id_entreprise INT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    criticality ENUM('Faible','Moyen','Élevé','Critique'),
    ipAddress VARCHAR(50),
    description TEXT,
    PRIMARY KEY(id_actif),
    FOREIGN KEY (id_entreprise) REFERENCES Entreprise(id_entreprise)
);

CREATE TABLE vulnerabilite (
    id_vulnerabilite INT AUTO_INCREMENT PRIMARY KEY,
    id_actif INT NOT NULL,
    id_entreprise INT,
    type_vulnerabilite VARCHAR(50),
    description TEXT,
    criticality VARCHAR(20) DEFAULT 'moyen',
    FOREIGN KEY (id_actif) REFERENCES actifs(id_actif) ON DELETE CASCADE
);

INSERT INTO Entreprise (name, sector, employees, servers, workstations, exposedServices) VALUES
('TechCorp', 'Technologie', 150, 20, 130, 'Site Web, Email, VPN, API REST, Cloud Services'),
('FinancePlus', 'Finance', 300, 40, 260, 'Site Web, Email'),
('HealthCare', 'Santé', 200, 25, 175, 'Site Web');

INSERT INTO actifs (id_entreprise, name, type, criticality, ipAddress, description) VALUES
-- TechCorp (1) -> risque ÉLEVÉ
(1, 'Base de données clients', 'Base de données', 'Critique', '192.168.1.10', 'Stocke les informations et historiques des clients'),
(1, 'Site web', 'Application Web', 'Élevé', '192.168.1.11', 'Site institutionnel accessible aux clients'),
(1, 'Serveur de fichiers', 'Serveur', 'Moyen', '192.168.1.12', 'Stockage partagé des documents internes'),
-- FinancePlus (2) -> risque MOYEN
(2, 'API bancaire', 'API', 'Élevé', '192.168.2.10', 'API pour les opérations bancaires'),
(2, 'Système de paiement', 'Application', 'Moyen', '192.168.2.11', 'Traite les transactions financières'),
(2, 'Portail client', 'Application Web', 'Moyen', '192.168.2.12', 'Espace client en ligne pour la gestion des comptes'),
-- HealthCare (3) -> risque FAIBLE
(3, 'Dossiers médicaux', 'Base de données', 'Moyen', '192.168.3.10', 'Contient les dossiers médicaux électroniques'),
(3, 'Serveur de rendez-vous', 'Serveur', 'Faible', '192.168.3.12', 'Gère la prise de rendez-vous des patients');

INSERT INTO vulnerabilite (id_actif, id_entreprise, type_vulnerabilite, description, criticality) VALUES
-- TechCorp (1) : actifs 1, 2, 3 -> ÉLEVÉ
(1, 1, 'Logiciel obsolète', 'Version obsolète de la base de données', 'Élevé'),
(2, 1, 'Port exposé', 'Port web exposé sans protection', 'Moyen'),
(3, 1, 'Configuration incorrecte', 'Droits d\'accès trop permissifs sur les partages', 'Moyen'),
-- FinancePlus (2) : actifs 4, 5, 6 -> MOYEN
(4, 2, 'Mot de passe faible', 'Politique de mot de passe faible', 'Moyen'),
(5, 2, 'Certificat expiré', 'Certificat TLS expiré', 'Moyen'),
(6, 2, 'Injection SQL', 'Formulaire vulnérable aux injections SQL', 'Faible'),
-- HealthCare (3) : actifs 7, 8 -> FAIBLE
(7, 3, 'Sauvegarde manquante', 'Absence de sauvegarde des données', 'Faible'),
(8, 3, 'Logiciel obsolète', 'Version obsolète de l\'application', 'Faible');