require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const companyRoutes = require('./routes/company');
const actifRoutes = require('./routes/actif');
const vulnerabiliteRoutes = require('./routes/vulnerabilite');
app.use('/api/company', companyRoutes);
app.use('/api/actifs', actifRoutes);
app.use('/api/vulnerabilite', vulnerabiliteRoutes);
app.listen(process.env.PORT, () => {
console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});