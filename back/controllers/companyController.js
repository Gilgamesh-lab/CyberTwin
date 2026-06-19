const db = require('../config/database');
exports.getCompany = (req, res) => {
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