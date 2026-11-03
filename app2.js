const express = require('express');
const path = require('path');

// Importar el modelo de datos
const datosModel = require('./models/datosModel');
const proceresModel = require('./models/proceresModel');
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
app.get('/shun', (req, res) => {
  res.render('shun', { titulo: 'shun' });
});


app.get('/ikki', (req, res) => {
  res.render('ikki', { titulo: 'ikki' });
});


app.get('/informacionGeneral', (req, res) => {
  res.render('informacionGeneral', { titulo: 'informacion General' });
});







app.get('/transferencias', (req, res) => {
  res.render('transferencias', { titulo: 'Transferencias' });
});


// --- NUEVAS RUTAS DE REGISTRO Y VER DATOS ---

// Vista del formulario para ingresar datos

// Rutas Crud
app.get('/ingresar', (req, res) => {
  res.render('ingresar', { titulo: 'Guardar Proceres Argentinos' });
});



// Procesar el envío del formulario y guardar en archivo JSON
app.post('/ingresar', (req, res) => {
  const { nombre, descripcion,logros, fecha_nacimiento} = req.body;
  
  proceresModel.guardar({ nombre, descripcion,logros,fecha_nacimiento});
  
  // Redireccionar a la vista de la tabla
  res.redirect('/registros_proceres');
});


// Vista con la tabla que muestra los datos guardados
app.get('/registros_proceres', (req, res) => {
  const listaDatos = proceresModel.obtenerTodos();
  res.render('registros_proceres', { 
    titulo: 'Listado de Registros', 
    datos: listaDatos 
  });
});



app.get('/proceres/editar/:id', (req, res) => {
  const procer = proceresModel.obtenerPorId(req.params.id);
  
  if (!procer) {
    return res.status(404).send('Prócer no encontrado');
  }

  res.render('editar_procer', { 
    titulo: 'Editar Prócer', 
    procer 
  });
});

// 2. Procesar la actualización de un prócer (vía POST desde el formulario de edición)
app.post('/proceres/editar/:id', (req, res) => {
  const { nombre, descripcion, logros, fecha_nacimiento } = req.body;
  
  proceresModel.editarPorId(req.params.id, { 
    nombre, 
    descripcion, 
    logros, 
    fecha_nacimiento 
  });
  
  res.redirect('/registros_proceres');
});

// 3. Procesar la eliminación de un prócer (vía POST)
app.post('/proceres/eliminar/:id', (req, res) => {
  proceresModel.eliminarPorId(req.params.id);
  res.redirect('/registros_proceres');
});

// 4. Ver el detalle individual de un prócer por su ID
app.get('/proceres/:id', (req, res) => {
  const procer = proceresModel.obtenerPorId(req.params.id);
  
  if (!procer) {
    return res.status(404).send('Prócer no encontrado');
  }

  res.render('detalle_procer', { 
    titulo: 'Detalle del Prócer', 
    procer 
  });
});




// Iniciar servidor
app.listen(PUERTO, () => {
  console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
});