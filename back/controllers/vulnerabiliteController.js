const db = require('../config/database');

exports.addVulnerabilite = (req, res) => {
    const {id_actif, id_entreprise, type_vulnerabilite, description, criticality} = req.body;
    db.query(
        'INSERT INTO vulnerabilite(id_actif, id_entreprise, type_vulnerabilite, description, criticality) VALUES(?,?,?,?,?)',
        [id_actif, id_entreprise || null, type_vulnerabilite, description, criticality || 'Moyen'],
        (err, result) => {
            if(err){
                console.error('Erreur ajout vulnérabilité:', err);
                return res.status(500).json(err);
            }
            res.status(201).json({
                message: "Vulnérabilité ajoutée",
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

exports.getVulnerabilitesByEntreprise = (req, res) => {
    const id = req.params.id;
    db.query(
        'SELECT * FROM vulnerabilite WHERE id_entreprise = ?',
        [id],
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
    const {id_actif, id_entreprise, type_vulnerabilite, description, criticality} = req.body;
    db.query(
        'UPDATE vulnerabilite SET id_actif = ?, id_entreprise = ?, type_vulnerabilite = ?, description = ?, criticality = ? WHERE id_vulnerabilite = ?',
        [id_actif, id_entreprise || null, type_vulnerabilite, description, criticality || 'Moyen', id],
        (err, result) => {
            if(err){
                console.error('Erreur modification vulnérabilité:', err);
                return res.status(500).json(err);
            }
            res.status(200).json({
                message: "Vulnérabilité mise à jour",
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
            res.status(200).json({
                message: "Vulnérabilité supprimée",
                id: id
            });
        }
    );
};
