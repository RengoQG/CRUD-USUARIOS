const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createPool } = require('mysql2/promise');
const { config } = require('dotenv'); 
const usersRouter = require('./routes/user.js');
const db = require('./db.js')

const app = express();
const PORT = 3000;

config();

app.use(bodyParser.json());

// Aplica el middleware cors a todas las rutas
app.use(cors());

app.use('/api', usersRouter);

// Nueva ruta para obtener la fecha actual desde la base de datos


// Iniciar el servidor
app.listen(PORT, function () {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



