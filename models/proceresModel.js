const fs = require('fs');
const path = require('path');

// Ruta donde se guardarán los datos de manera persistente
const rutaArchivo = path.join(__dirname, '../data/proceres_argentinos.json');

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


// Obtener un registro específico por su ID
function obtenerPorId(id) {
  const datos = obtenerTodos();
  // Comparamos convirtiendo a Number por si acaso el ID llega como string desde una URL o parámetro
  return datos.find(registro => Number(registro.id) === Number(id)) || null;
}

// Editar un registro existente por su ID
function editarPorId(id, datosActualizados) {
  asegurarArchivo();
  const datos = obtenerTodos();
  const index = datos.findIndex(registro => Number(registro.id) === Number(id));

  // Si no se encuentra el registro, retornamos null o false
  if (index === -1) {
    return null;
  }

  // Mantenemos el ID original y actualizamos el resto de los campos
  datos[index] = {
    ...datos[index],
    ...datosActualizados,
    id: Number(id), // Aseguramos que no se sobrescriba el ID
    fechaActualizacion: new Date().toLocaleString('es-AR') // Opcional: registrar cuándo se modificó
  };

  fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2), 'utf-8');
  return datos[index];
}

// Eliminar un registro por su ID
function eliminarPorId(id) {
  asegurarArchivo();
  const datos = obtenerTodos();
  const index = datos.findIndex(registro => Number(registro.id) === Number(id));

  if (index === -1) {
    return false; // Retorna false si no lo encontró para eliminar
  }

  // Quitamos el elemento del array
  const eliminado = datos.splice(index, 1)[0];
  fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2), 'utf-8');
  
  return eliminado; // Retorna el objeto que fue eliminado
}










module.exports = {
  obtenerTodos,
  guardar,
  obtenerPorId,
  editarPorId,
  eliminarPorId
};