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

exports.addActif = (req, res) => {
    const {name, type, criticality, ipAddress, description, exposition_internet} = req.body;
    db.query(
        'INSERT INTO actifs(name, type, criticality,ipAddress,description, exposition_internet) VALUES(?,?,?,?, ?)',
        [name, type, criticality, ipAddress, description, exposition_internet],
    (err, result) => {
        if(err){
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "Actif ajouté"
        });
        }
    );
};