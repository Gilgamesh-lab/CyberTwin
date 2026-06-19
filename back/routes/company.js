const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
router.get('/getCompanies', companyController.getCompanies);
router.get('/getCompagny/:id', companyController.getCompany);
router.get('/getCompanyActifs/:id', companyController.getCompanyActifs);
module.exports = router;