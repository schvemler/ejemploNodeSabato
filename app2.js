const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Importar el modelo desde la carpeta models
const Registro = require('./models/Registro');

const app = express();
const PUERTO = 3000;

// Configuración de Middlewares y EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mi_base_de_datos')
  .then(() => console.log('Conectado exitosamente a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// --- Rutas ---

app.get('/', (req, res) => {
  res.render('inicio', { titulo: 'Página Principal' });
});

app.get('/nosotros', (req, res) => {
  res.render('nosotros', { titulo: 'Sobre Nosotros' });
});

app.get('/contacto', (req, res) => {
  res.render('contacto', { titulo: 'Contáctanos' });
});

app.get('/lamaxilista', (req, res) => {
  res.render('lamaxilista', { titulo: 'Contáctanos' });
});

app.get('/transferencias', (req, res) => {
  res.render('transferencias', { titulo: 'Contáctanos' });
});

// Rutas del Formulario y Tabla
app.get('/nuevo', (req, res) => {
  res.render('nuevo', { titulo: 'Ingresar Datos' });
});

app.post('/guardar', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    await Registro.create({ nombre, email, mensaje });
    res.redirect('/registros');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al guardar los datos');
  }
});

app.get('/registros', async (req, res) => {
  try {
    const registros = await Registro.find().sort({ fecha: -1 });
    res.render('registros', { titulo: 'Lista de Registros', registros });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.listen(PUERTO, () => {
  console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
});