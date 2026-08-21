const express = require('express');
const path = require('path');

const app = express();
const PUERTO = 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// 1. Ruta para la página de Inicio (http://localhost:3000/)
app.get('/', (req, res) => {
  res.render('inicio', { titulo: 'Página Principal' });
});

// 2. Ruta para Nosotros (http://localhost:3000/nosotros)
app.get('/nosotros', (req, res) => {
  res.render('nosotros', { titulo: 'Sobre Nosotros' });
});

// 3. Ruta para Contacto (http://localhost:3000/contacto)
app.get('/contacto', (req, res) => {
  res.render('contacto', { titulo: 'Contáctanos' });
});

// 4. Ruta para Contacto (http://localhost:3000/contacto)
app.get('/lamaxilista', (req, res) => {
  res.render('lamaxilista', { titulo: 'Contáctanos' });
});

// 5. Ruta para Contacto (http://localhost:3000/contacto)
app.get('/transferencias', (req, res) => {
  res.render('transferencias', { titulo: 'Contáctanos' });
});




// Iniciar servidor
app.listen(PUERTO, () => {
  console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
});