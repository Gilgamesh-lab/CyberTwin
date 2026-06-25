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
   gestion_vulnerabilites TEXT,
   risque_cyber TEXT,
   PRIMARY KEY(id_entreprise)
);

CREATE TABLE actifs (
    id_actif INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    criticality ENUM('Faible','Moyen','Élevé','Critique'),
    ipAddress VARCHAR(50),
    description TEXT,
    exposition_internet BOOLEAN DEFAULT false,
    PRIMARY KEY(id_actif)
);

CREATE TABLE vulnerabilite (
    id_vulnerabilite INT AUTO_INCREMENT PRIMARY KEY,
    id_actif INT NOT NULL,
    cve VARCHAR(50),
    description TEXT,
    score_cvss DECIMAL(3,1),
    statut ENUM('Ouverte','En cours','Corrigée'),
    date_detection DATE,
    criticality VARCHAR(20) DEFAULT 'moyen',
    FOREIGN KEY (id_actif) REFERENCES actifs(id_actif) ON DELETE CASCADE
);

INSERT INTO Entreprise (name, sector, employees, servers, workstations, exposedServices, gestion_vulnerabilites, risque_cyber) VALUES
('TechCorp', 'Technologie', 150, 20, 130, 'VPN, API REST, Portail client', 'Scan mensuel et patch trimestriel', 'Élevé'),
('FinancePlus', 'Finance', 300, 40, 260, 'Banque en ligne, API bancaires, VPN', 'Gestion continue des vulnérabilités', 'Critique'),
('HealthCare', 'Santé', 200, 25, 175, 'Portail patient HTTPS, VPN, Messagerie Web', 'Scan hebdomadaire et correctifs mensuels', 'Élevé');

INSERT INTO actifs (name, type, criticality, ipAddress, description, exposition_internet) VALUES
('Base de données clients', 'Base de données', 'Critique', '192.168.1.10', 'Stocke les informations et historiques des clients', FALSE),
('Site web', 'Application Web', 'Élevé', '192.168.1.11', 'Site institutionnel accessible aux clients', TRUE),
('Serveur de fichiers', 'Serveur', 'Moyen', '192.168.1.12', 'Stockage partagé des documents internes', FALSE),
('API bancaire', 'API', 'Critique', '192.168.2.10', 'API pour les opérations bancaires', TRUE),
('Système de paiement', 'Application', 'Critique', '192.168.2.11', 'Traite les transactions financières', TRUE),
('Dossiers médicaux', 'Base de données', 'Critique', '192.168.3.10', 'Contient les dossiers médicaux électroniques', FALSE),
('Portail patient', 'Application Web', 'Élevé', '192.168.3.11', 'Portail pour les patients', TRUE),
('Messagerie interne', 'Application', 'Moyen', '192.168.3.12', 'Messagerie pour le personnel', FALSE);

INSERT INTO vulnerabilite (id_actif, cve, description, score_cvss, statut, date_detection, criticality) VALUES
(1, 'CVE-2025-1001', 'Injection SQL sur la base de données', 8.5, 'Ouverte', '2025-05-10', 'Élevé'),
(1, 'CVE-2025-1002', 'Accès non autorisé aux données', 7.8, 'En cours', '2025-05-15', 'Élevé'),
(2, 'CVE-2025-1003', 'Cross Site Scripting', 6.5, 'Corrigée', '2025-04-20', 'Moyen'),
(4, 'CVE-2025-1004', 'Faille d\'authentification', 9.2, 'Ouverte', '2025-05-20', 'Critique'),
(5, 'CVE-2025-1005', 'Vulnérabilité TLS', 8.9, 'En cours', '2025-05-18', 'Élevé'),
(6, 'CVE-2025-1006', 'Exposition de données sensibles', 9.1, 'Ouverte', '2025-05-22', 'Critique'),
(7, 'CVE-2025-1007', 'Upload de fichiers arbitraires', 8.0, 'En cours', '2025-05-12', 'Élevé'),
(8, 'CVE-2025-1008', 'Politique de mot de passe faible', 5.5, 'Corrigée', '2025-04-10', 'Faible');