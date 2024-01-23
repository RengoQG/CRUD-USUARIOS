// db.js
const { createPool } = require('mysql2/promise');
const { config } = require('dotenv');
config(); // Cargar las variables de entorno desde el archivo .env
console.log('Contraseña:', process.env.MYSQLDB_PASSWORD);

const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: 'root',
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQLDB_PASSWORD,
    database: 'Usuarios2'
});


module.exports = pool;
