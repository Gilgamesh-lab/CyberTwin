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
    const {id_entreprise, name, type, criticality, ipAddress, description} = req.body;
    db.query(
        'INSERT INTO actifs(id_entreprise, name, type, criticality, ipAddress, description) VALUES(?,?,?,?,?,?)',
        [id_entreprise || null, name, type, criticality, ipAddress, description],
    (err, result) => {
        if(err){
         console.error('Erreur ajout actif:', err);
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "Actif ajouté",
            id: result.insertId
        });
        }
    );
};


exports.modifierActif = (req, res) => {
    const id = req.params.id;
    const {id_entreprise, name, type, criticality, ipAddress, description} = req.body;
    db.query(
        "UPDATE actifs SET id_entreprise = ?, name = ?, type = ?, criticality = ?, ipAddress = ?, description = ? WHERE id_actif = ?",
        [id_entreprise || null, name, type, criticality, ipAddress, description, id],
    (err, result) => {
        if(err){
         console.error('Erreur modification actif:', err);
         return res.status(500).json(err);
        }
        res.status(201).json({
            message: "Actifs mis à jour",
            id: id
        });
        }
    );
};


exports.supprimeActif = (req, res) => {
    const id = parseInt(req.params.id);
    console.log('Tentative de suppression actif ID:', id);
    
    db.query(
        'DELETE FROM vulnerabilite WHERE id_actif = ?',
        [id],
    (err, result) => {
        if(err){
         console.error('Erreur suppression vulnérabilités associées:', err);
         return res.status(500).json(err);
        }
        console.log('Vulnérabilités associées supprimées');
        
        db.query(
            'DELETE FROM actifs WHERE id_actif = ?',
            [id],
        (err, result) => {
            if(err){
             console.error('Erreur suppression actif:', err);
             return res.status(500).json(err);
            }
            console.log('Actif supprimé avec succès, ID:', id);
            res.status(201).json({
                message: "Actif supprimé",
                id: id
            });
            }
        );
    });
};