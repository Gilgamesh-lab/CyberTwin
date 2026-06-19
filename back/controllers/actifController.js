const db = require('../config/database');
exports.getActifs = (req, res) => {
    db.query(
        'SELECT * FROM actifs',
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
};


exports.getActif = (req, res) => {
    const id = req.params.id;
    db.query(
        'SELECT * FROM actifs where id_actif = ' + id,
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
};

exports.getActifVulnerabilite = (req, res) => {
    const id = req.params.id;
    db.query(
        'SELECT * FROM vulnerabilite where id_actif = ' + id,
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
};