//Rutas relacionadas con los usuairos
// routes/users.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db.js');



const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificar si el encabezado tiene el formato esperado
  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  jwt.verify(token, 'tu_secreto_secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.userData = decoded;
    next();
  });
};


router.get('/user', async (req, res) => {
  try {
    // Consultar un usuario desde la base de datos
    const [rows, fields] = await db.execute('SELECT * FROM users LIMIT 1');
    
    // Verificar si se obtuvo algún resultado
    if (rows.length > 0) {
      const user = rows[0];
      res.json({ user });
    } else {
      res.status(404).json({ message: 'No se encontraron usuarios' });
    }
  } catch (error) {
    console.error('Error al obtener el usuario desde la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//CRUD
// Listar usuarios
router.get('/usersT', verifyToken, async (req, res) => {
  try {
    // Realizar la lógica para obtener la lista de usuarios desde la base de datos
    const [rows, fields] = await db.execute('SELECT id, username, email FROM users');

    // Enviar la lista de usuarios como respuesta
    res.json({ users: rows });
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//Iniciar sesión
router.post('/login', async (req, res) => {
  // Obtener las credenciales del cuerpo de la solicitud
  const { email, password } = req.body;

  // Validar que se proporcionen todos los campos necesarios
  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar las credenciales del usuario en la base de datos
    const [rows, fields] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

    // Si las credenciales son válidas, generar un token JWT
    if (rows.length > 0) {
      const user = rows[0].username;
      const userId = rows[0].id;
      const token = jwt.sign({ userId, email, user }, 'tu_secreto_secreto', { expiresIn: '1h' });
      res.json({ NombreUsuario: user, token: token });
    } else {
      // Credenciales inválidas
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error al verificar las credenciales del usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//DECODIFICAR TOKEN
router.get('/verificar-token', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
  }

  try {
    // Verificar el token de forma asincrónica
    const datos = await jwt.verify(token, 'tu_secreto_secreto');

    // El token se decodificó con éxito
    console.log('Token decodificado:', datos);
    
    // Puedes acceder a la información del payload como decoded.userId, decoded.email, etc.
    res.json({ datos });
  } catch (error) {
    console.error('Error al decodificar el token:', error.message);
    res.status(401).json({ message: 'Acceso no autorizado. Token no válido.' });
  }
});


// Registrar usuario
router.post('/signup',verifyToken, async (req, res) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { username, password, email } = req.body;

    // Validar que se proporcionen todos los campos necesarios
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe en la base de datos (usaremos el correo como identificador único)
    const [existingUsers, _] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    // Si ya existe un usuario con ese correo, enviar un mensaje de error
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    // Si no existe, proceder a registrar al nuevo usuario
    await db.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);

    // Registro exitoso
    res.status(201).json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error al registrar el nuevo usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor, no puede registrar' });
  } 
});

//Listar por ID
router.get('/listar-usuario/:id', verifyToken, async(req,res) => {
  const userId = req.params.id;

  if(!userId){
    console.log('No se ha proporcionado el id');
    return res.status(404).json({message:'No se proporciono el id'})
  }

  try {
   const [results] = await db.execute('SELECT id, username, email FROM users WHERE id = ?', [userId]);

    if(results.length === 0){
      return res.status(404).json({message:'Usuario no encontrado'});
    }


    const user = results[0];
    res.json(user);

  } catch (error) {
    console.error('Error al traer  al usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor, no puede registrar' });
  }
});


router.put('/users/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  // Validar que se proporcionen todos los campos necesarios
  if (!username || !email) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si el correo electrónico ya existe en la base de datos, excluyendo al usuario actual
    if (email !== req.userData.email) {
      const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

      // Si ya existe un usuario con ese correo, enviar un mensaje de error
      if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'El correo ya existe' });
      }
    }

    // Realizar la actualización en la base de datos
    const [results] = await db.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId]);

    // Verificar si se actualizó correctamente
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Respuesta exitosa
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//Eliminar
router.delete('/users/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Realizar la eliminación en la base de datos
    const [results] = await db.execute('DELETE FROM users WHERE id = ?', [userId]);

    // Verificar si se eliminó correctamente
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Respuesta exitosa
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



module.exports = router;
