const db = require('../config/database');

exports.addVulnerabilite = (req, res) => {
    const {id_actif,cve, description, criticality} = req.body;
    db.query(
        'INSERT INTO vulnerabilite(id_actif, cve, description, criticality) VALUES(?,?,?,?)',
        [id_actif, cve, description, criticality || 'moyen'],
    (err, result) => {
        if(err){
         console.error('Erreur ajout vulnérabilité:', err);
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "vulnerabilite ajouté",
            id: result.insertId
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
    const {id_actif,cve, description, criticality} = req.body;
    db.query(
        "UPDATE vulnerabilite SET id_actif = ?, cve = ?, description = ?, criticality = ? WHERE id_vulnerabilite = ?",
        [id_actif, cve, description, criticality || 'moyen', id],
    (err, result) => {
        if(err){
         console.error('Erreur modification vulnérabilité:', err);
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "vulnerabilite mis à jour",
            id: id
        });
        }
    );
};

exports.supprimerVulnerabilite = (req, res) => {
    const id = parseInt(req.params.id);
    db.query(
        'DELETE FROM vulnerabilite WHERE id_vulnerabilite = ?',
        [id],
    (err, result) => {
        if(err){
         console.error('Erreur suppression vulnérabilité:', err);
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "vulnerabilite supprimé",
            id: id
        });
        }
    );
};