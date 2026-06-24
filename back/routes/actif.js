const express = require('express');
const router = express.Router();
const actifController = require('../controllers/actifController');
router.get('/getActifs', actifController.getActifs);
router.get('/getActif/:id', actifController.getActif);
router.post('/addActif', actifController.addActif);
router.delete('/supprimerActif/:id', actifController.supprimeActif);
router.put('/modifierActif/:id', actifController.modifierActif);
module.exports = router;