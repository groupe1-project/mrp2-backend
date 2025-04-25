require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const productRoutes = require('./routes/productRoutes');
const nomenclatureRoutes = require('./routes/nomenclatureRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stock', stockRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(cors({
    origin: 'http://localhost:3000', // ou votre port frontend
    credentials: true
  }));

app.use('/api/products', productRoutes);
app.use('/api/nomenclatures', nomenclatureRoutes);