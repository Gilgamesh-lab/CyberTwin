const db = require('../config/database');

exports.addVulnerabilite = (req, res) => {
    const {id_actif,cve, description, score_cvss, statut, date_detection} = req.body;
    db.query(
        'INSERT INTO vulnerabilite(id_actif, cve, description, score_cvss, statut, date_detection) VALUES(?,?,?,?,?,?)',
        [id_actif, cve, description, score_cvss, statut, date_detection],
    (err, result) => {
        if(err){
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "vulnerabilite ajouté"
        });
        }
    );
};


exports.getVulnerabilite = (req, res) => {
    db.query(
        'SELECT * FROM vulnerabilite',
        (err, results) => {
            if(err){
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
};

exports.modifierVulnerabilite = (req, res) => {
    const id = req.params.id;
    const {id_actif,cve, description, score_cvss, statut, date_detection} = req.body;
    db.query(
        "UPDATE vulnerabilite SET id_actif = ?, cve = ?, description = ?, score_cvss = ?, statut = ? WHERE id_vulnerabilite  =  ?",
        [id_actif, cve, description, score_cvss, statut, id],
    (err, result) => {
        if(err){
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "vulnerabilite mis à jour"
        });
        }
    );
};

exports.supprimerVulnerabilite = (req, res) => {
    const id = req.params.id;
    db.query(
        'DELETE FROM vulnerabilite WHERE id_vulnerabilite = ' + id,
    (err, result) => {
        if(err){
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "vulnerabilite supprimé"
        });
        }
    );
};