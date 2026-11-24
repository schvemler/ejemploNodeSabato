const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rutaCarpeta = path.join(__dirname, '../data');
const rutaAuth = path.join(rutaCarpeta, 'auth.json');

function hashearClave(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function asegurarCarpeta() {
  if (!fs.existsSync(rutaCarpeta)) {
    fs.mkdirSync(rutaCarpeta, { recursive: true });
  }
}

function obtenerAuth() {
  if (!fs.existsSync(rutaAuth)) return null;
  try {
    return JSON.parse(fs.readFileSync(rutaAuth, 'utf-8'));
  } catch (error) {
    return null;
  }
}

function tienePasswordConfigurada() {
  const auth = obtenerAuth();
  return Boolean(auth && auth.passwordHash);
}

function crearPassword(password) {
  asegurarCarpeta();
  const data = {
    passwordHash: hashearClave(password),
    creadoEn: new Date().toLocaleString('es-AR')
  };
  fs.writeFileSync(rutaAuth, JSON.stringify(data, null, 2), 'utf-8');
}

function verificarPassword(password) {
  const auth = obtenerAuth();
  if (!auth || !auth.passwordHash) return false;
  return hashearClave(password) === auth.passwordHash;
}

module.exports = {
  tienePasswordConfigurada,
  crearPassword,
  verificarPassword
};