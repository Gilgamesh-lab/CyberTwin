const express = require('express');
const router = express.Router();
const vulnerabiliteController = require('../controllers/vulnerabiliteController');
router.post('/addVulnerabilite', vulnerabiliteController.addVulnerabilite);
router.get('/getVulnerabilite', vulnerabiliteController.getVulnerabilite);
router.put('/modifierVulnerabilite/:id', vulnerabiliteController.modifierVulnerabilite);
router.delete('/supprimerVulnerabilite/:id', vulnerabiliteController.supprimerVulnerabilite);
module.exports = router;