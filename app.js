const express = require('express');
const path = require('path');

const app = express();
const PUERTO = 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta principal
app.get('/', (req, res) => {
  // Renderiza index.ejs e inyecta los partials automáticamente
  res.render('pan');
});

// Iniciar servidor
app.listen(PUERTO, () => {
  console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
});