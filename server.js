require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'salmita456',
  database: process.env.DB_NAME || 'mrp2_system'
});

// API pour récupérer les produits
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/products', (req, res) => {
  const { code, name, stock, allocated, location } = req.body;
  const available = stock - allocated;
  if(!code || !name || stock === undefined){
    return res.status(400).json({ error: "Champs obligatoires manquants : code, name, stock" });
  }

  db.query(
    'INSERT INTO products (code, name, stock, allocated, available, location) VALUES (?, ?, ?, ?, ?, ?)',
    [code, name, stock, allocated, available, location],
    (err, result) => {
      if (err){
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: "Ce code produit existe déjà" });
        }

         return res.status(500).json({ error: "Erreur serveur lors de l'ajout" });}
         res.json({ id: result.insertId , message: "Produit ajouté avec succès !" });
    }
  );
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));