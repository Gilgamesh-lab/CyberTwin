require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const companyRoutes = require('./routes/company');
app.use('/api', companyRoutes);
app.listen(process.env.PORT, () => {
console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});