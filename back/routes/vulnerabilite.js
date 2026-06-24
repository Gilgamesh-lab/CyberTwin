const express = require('express');
const router = express.Router();
const vulnerabiliteController = require('../controllers/vulnerabiliteController');
router.post('/addVulnerabilite', vulnerabiliteController.addVulnerabilite);
router.get('/getVulnerabilite', vulnerabiliteController.getVulnerabilite);
module.exports = router;