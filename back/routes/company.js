const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
router.get('/getCompanies', companyController.getCompanies);
router.get('/getCompany/:id', companyController.getCompany);
router.get('/getCompanyActifs/:id', companyController.getCompanyActifs);
router.post('/addCompany', companyController.addCompagny);
router.put('/updateCompany/:id', companyController.updateCompagny);
module.exports = router;