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
                } else if (!company.exposedServices) {
                    company.exposedServices = [];
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
        'SELECT * FROM Entreprise WHERE id_entreprise = ?',
        [id],
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            const parsedResults = results.map(company => {
                if (company.exposedServices && typeof company.exposedServices === 'string') {
                    company.exposedServices = company.exposedServices.split(', ').filter(s => s);
                } else if (!company.exposedServices) {
                    company.exposedServices = [];
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
        'SELECT * FROM actifs WHERE id_entreprise = ?',
        [id],
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
};

exports.addCompagny = (req, res) => {
    const {name, sector, employees, servers, workstations, exposedServices} = req.body;
    const servicesString = Array.isArray(exposedServices) ? exposedServices.join(', ') : (exposedServices || '');
    db.query(
        'INSERT INTO Entreprise(name, sector, employees, servers, workstations, exposedServices) VALUES(?,?,?,?,?,?)',
        [name, sector, employees, servers, workstations, servicesString],
        (err, result) => {
            if(err){
                return res.status(500).json(err);
            }
            res.status(201).json({
                message: "Entreprise ajoutée",
                id: result.insertId
            });
        }
    );
};

exports.updateCompagny = (req, res) => {
    const id = req.params.id;
    const {name, sector, employees, servers, workstations, exposedServices} = req.body;
    const servicesString = Array.isArray(exposedServices) ? exposedServices.join(', ') : (exposedServices || '');
    db.query(
        'UPDATE Entreprise SET name = ?, sector = ?, employees = ?, servers = ?, workstations = ?, exposedServices = ? WHERE id_entreprise = ?',
        [name, sector, employees, servers, workstations, servicesString, id],
        (err, result) => {
            if(err){
                return res.status(500).json(err);
            }
            res.status(200).json({
                message: "Entreprise mise à jour"
            });
        }
    );
};
