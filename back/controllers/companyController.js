const db = require('../config/database');
exports.getCompanies = (req, res) => {
    db.query(
        'SELECT * FROM Entreprise',
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            const parsedResults = results.map(company => {
                if (company.exposedServices && typeof company.exposedServices === 'string') {
                    company.exposedServices = company.exposedServices.split(', ').filter(s => s);
                }
                if (company.services_exposes && typeof company.services_exposes === 'string') {
                    company.services_exposes = company.services_exposes.split(', ').filter(s => s);
                }
                return company;
            });
            res.json(parsedResults);
        }
    );
};

exports.getCompany = (req, res) => {
    const id = req.params.id;
    db.query(
        'SELECT * FROM Entreprise where id_entreprise = ' + id,
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            const parsedResults = results.map(company => {
                if (company.exposedServices && typeof company.exposedServices === 'string') {
                    company.exposedServices = company.exposedServices.split(', ').filter(s => s);
                }
                if (company.services_exposes && typeof company.services_exposes === 'string') {
                    company.services_exposes = company.services_exposes.split(', ').filter(s => s);
                }
                return company;
            });
            res.json(parsedResults);
        }
    );
};

exports.getCompanyActifs = (req, res) => {
    const id = req.params.id;
    db.query(
        'SELECT * FROM actifs where id_entreprise = ' + id,
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
};

exports.addCompagny = (req, res) => {
    const {name, sector, employees, servers, workstations, exposedServices, gestion_vulnerabilites, risque_cyber} = req.body;
    const servicesString = Array.isArray(exposedServices) ? exposedServices.join(', ') : '';
    db.query(
        'INSERT INTO Entreprise(name, sector, employees, servers, workstations, exposedServices, gestion_vulnerabilites, risque_cyber) VALUES(?,?,?,?,?,?,?,?)',
        [name, sector, employees, servers, workstations, servicesString, gestion_vulnerabilites, risque_cyber],
    (err, result) => {
        if(err){
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "Entreprise ajouté"
        });
        }
    );
};

exports.updateCompagny = (req, res) => {
    const id = req.params.id;
    const {nom, secteur_activite, nombre_employes, nombre_serveurs, nombre_postes_clients, services_exposes, gestion_vulnerabilites, risque_cyber} = req.body;
    const servicesString = Array.isArray(services_exposes) ? services_exposes.join(', ') : '';
    db.query(
        "UPDATE Entreprise SET nom = ?, secteur_activite = ?, nombre_employes = ?, nombre_serveurs = ?, nombre_postes_clients = ?, services_exposes = ?, gestion_vulnerabilites = ?, risque_cyber = ? WHERE id_entreprise  =  ?",
        [nom, secteur_activite, nombre_employes, nombre_serveurs, nombre_postes_clients, servicesString, gestion_vulnerabilites, risque_cyber, id],
    (err, result) => {
        if(err){
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "Entreprise mis à jour"
        });
        }
    );
};