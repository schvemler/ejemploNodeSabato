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

//obtener registro por ID

function obtenerPorId(id) {
  const datos = obtenerTodos();
  // Comparamos convirtiendo a String o Number por seguridad en los tipos de ID
  return datos.find(item => String(item.id) === String(id)) || null;
}

// Actualizar un registro existente por su ID (UPDATE)
function actualizar(id, datosActualizados) {
  asegurarArchivo();
  const datos = obtenerTodos();
  let registroActualizado = null;

  const datosModificados = datos.map(item => {
    if (String(item.id) === String(id)) {
      registroActualizado = {
        ...item,
        ...datosActualizados,
        id: item.id, // Mantenemos el ID original intacto
        fechaModificacion: new Date().toLocaleString('es-AR')
      };
      return registroActualizado;
    }
    return item;
  });

  if (registroActualizado) {
    fs.writeFileSync(rutaArchivo, JSON.stringify(datosModificados, null, 2), 'utf-8');
  }

  return registroActualizado; // Retorna el objeto actualizado o null si no existe
}

// Eliminar un registro por su ID (DELETE)
function eliminar(id) {
  asegurarArchivo();
  const datos = obtenerTodos();
  const datosFiltrados = datos.filter(item => String(item.id) !== String(id));

  // Si la longitud es menor, significa que se encontró y eliminó un elemento
  if (datosFiltrados.length !== datos.length) {
    fs.writeFileSync(rutaArchivo, JSON.stringify(datosFiltrados, null, 2), 'utf-8');
    return true;
  }

  return false; // Retorna false si no se encontró el ID
}









module.exports = {
  obtenerTodos,
  guardar,
  obtenerPorId,
  actualizar,
  eliminar
};