//===================
// Puerto
//===================
process.env.PORT = process.env.PORT || 3000;

//===================
// Entorno
//===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// Vencimiento del Token
//===================

process.env.CADUC_TOKEN = 60 * 60 * 24 * 30;

//===================
// SEED de auteticacion
//===================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//===================
// Base de datos
//===================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//===================
// Google Client ID
//===================

process.env.CLIENT_ID = process.env.CLIENT_ID || '464469951303-v1fsr5hh2ahod2rqmj3d4vphgpjl89hc.apps.googleusercontent.com';