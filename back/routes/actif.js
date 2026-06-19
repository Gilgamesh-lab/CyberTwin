const express = require('express');
const router = express.Router();
const actifController = require('../controllers/actifController');
router.get('/getActifs', actifController.getActifs);
router.get('/getActif/:id', actifController.getActif);
router.get('/getActifVulnerabilite/:id', actifController.getActifVulnerabilite);
module.exports = router;