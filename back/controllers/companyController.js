const db = require('../config/database');
exports.getCompanies = (req, res) => {
    db.query(
        'SELECT * FROM Entreprise',
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json(results);
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
            res.json(results);
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