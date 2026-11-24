const express = require('express');
const path = require('path');
const crypto = require('crypto');

// Importar el modelo de datos
const datosModel = require('./models/datosModel');
//para importar el modelo de datos de los proceres
const proceresModel = require('./models/proceresModel');
// Importar el modelo de autenticación en JSON
const authModel = require('./models/authModel');

const app = express();
const PUERTO = 3000;

// Tokens activos solo en memoria (se pierden al reiniciar el servidor)
const sesionesActivas = new Set();
const NOMBRE_COOKIE = 'acceso_sesion';

function leerCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return header.split(';').reduce((acc, parte) => {
    const [clave, ...valor] = parte.trim().split('=');
    if (clave) acc[clave] = decodeURIComponent(valor.join('='));
    return acc;
  }, {});
}

function tieneSesionValida(req) {
  const cookies = leerCookies(req);
  const token = cookies[NOMBRE_COOKIE];
  return Boolean(token && sesionesActivas.has(token));
}

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para archivos estáticos y envío de formularios POST
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Middleware de bloqueo: permite /acceso y deja pasar si la cookie está en sesionesActivas
app.use((req, res, next) => {
  if (req.path === '/acceso') {
    return next();
  }

  if (tieneSesionValida(req)) {
    return next();
  }

  return res.redirect('/acceso');
});

// Rutas para crear o ingresar la contraseña guardada en JSON
app.get('/acceso', (req, res) => {
  const primeraVez = !authModel.tienePasswordConfigurada();
  res.render('acceso', {
    titulo: primeraVez ? 'Configurar contraseña' : 'Ingresar contraseña',
    primeraVez,
    error: null
  });
});

app.post('/acceso', (req, res) => {
  const { password, confirmarPassword } = req.body;
  const primeraVez = !authModel.tienePasswordConfigurada();

  if (!password || password.trim().length < 4) {
    return res.render('acceso', {
      titulo: primeraVez ? 'Configurar contraseña' : 'Ingresar contraseña',
      primeraVez,
      error: 'La contraseña debe tener al menos 4 caracteres.'
    });
  }

  if (primeraVez) {
    if (password !== confirmarPassword) {
      return res.render('acceso', {
        titulo: 'Configurar contraseña',
        primeraVez: true,
        error: 'Las contraseñas no coinciden.'
      });
    }
    authModel.crearPassword(password);
  } else if (!authModel.verificarPassword(password)) {
    return res.render('acceso', {
      titulo: 'Ingresar contraseña',
      primeraVez: false,
      error: 'Contraseña incorrecta.'
    });
  }

  // Crear sesión temporal en memoria y cookie de sesión (sin maxAge)
  const token = crypto.randomBytes(24).toString('hex');
  sesionesActivas.add(token);

  res.cookie(NOMBRE_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax'
  });

  return res.redirect('/');
});

// Ruta opcional para bloquear / cerrar sesión manualmente
app.post('/salir', (req, res) => {
  const cookies = leerCookies(req);
  const token = cookies[NOMBRE_COOKIE];
  if (token) {
    sesionesActivas.delete(token);
  }
  res.clearCookie(NOMBRE_COOKIE);
  return res.redirect('/acceso');
});

// --- RUTAS EXISTENTES ---

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
app.get('/ingresar', (req, res) => {
  res.render('ingresar', { titulo: 'Guardar Proceres Argentinos' });
});

app.post('/ingresar', (req, res) => {
  const { nombre, descripcion, logros, fecha_nacimiento } = req.body;
  proceresModel.guardar({ nombre, descripcion, logros, fecha_nacimiento });
  res.redirect('/registros_proceres');
});

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

app.post('/proceres/eliminar/:id', (req, res) => {
  proceresModel.eliminarPorId(req.params.id);
  res.redirect('/registros_proceres');
});

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