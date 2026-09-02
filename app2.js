const express = require('express');
const path = require('path');

// Importar el modelo de datos
const datosModel = require('./models/datosModel');

const app = express();
const PUERTO = 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para archivos estáticos y envío de formularios POST
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


// 1. Ruta para la página de Inicio
app.get('/', (req, res) => {
  res.render('inicio', { titulo: 'Página Principal' });
});

// 2. Ruta para Nosotros
app.get('/nosotros', (req, res) => {
  res.render('nosotros', { titulo: 'Sobre Nosotros' });
});

// 3. Ruta para Contacto
app.get('/contacto', (req, res) => {
  res.render('contacto', { titulo: 'Contáctanos' });
});

// 4. Ruta para La Maxi Lista
app.get('/lamaxilista', (req, res) => {
  res.render('lamaxilista', { titulo: 'La Maxi Lista' });
});

// 5. Ruta para Transferencias
app.get('/transferencias', (req, res) => {
  res.render('transferencias', { titulo: 'Transferencias' });
});


// --- NUEVAS RUTAS DE REGISTRO Y VER DATOS ---

// Vista del formulario para ingresar datos
app.get('/ingresar', (req, res) => {
  res.render('formulario', { titulo: 'Ingresar Nuevos Datos' });
});

// Procesar el envío del formulario y guardar en archivo JSON
app.post('/ingresar', (req, res) => {
  const { nombre, descripcion, monto } = req.body;
  
  datosModel.guardar({ nombre, descripcion, monto });
  
  // Redireccionar a la vista de la tabla
  res.redirect('/registros');
});

// Vista con la tabla que muestra los datos guardados
app.get('/registros', (req, res) => {
  const listaDatos = datosModel.obtenerTodos();
  res.render('tabla', { 
    titulo: 'Listado de Registros', 
    datos: listaDatos 
  });
});


// Iniciar servidor
app.listen(PUERTO, () => {
  console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
});