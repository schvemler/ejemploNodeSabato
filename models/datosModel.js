const fs = require('fs');
const path = require('path');

// Ruta donde se guardarán los datos de manera persistente
const rutaArchivo = path.join(__dirname, '../data/datos.json');

// Función auxiliar para asegurar que la carpeta /data y el archivo existen
function asegurarArchivo() {
  const carpetaData = path.join(__dirname, '../data');
  if (!fs.existsSync(carpetaData)) {
    fs.mkdirSync(carpetaData, { recursive: true });
  }
  if (!fs.existsSync(rutaArchivo)) {
    fs.writeFileSync(rutaArchivo, JSON.stringify([]), 'utf-8');
  }
}

// Obtener todos los registros del archivo JSON
function obtenerTodos() {
  asegurarArchivo();
  const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
  try {
    return JSON.parse(contenido);
  } catch (error) {
    return [];
  }
}

// Guardar un nuevo registro
function guardar(nuevoDato) {
  asegurarArchivo();
  const datos = obtenerTodos();
  
  // Asignar un ID único y timestamp opcional
  const registro = {
    id: Date.now(),
    ...nuevoDato,
    fecha: new Date().toLocaleString('es-AR')
  };

  datos.push(registro);
  fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2), 'utf-8');
  return registro;
}

module.exports = {
  obtenerTodos,
  guardar
};