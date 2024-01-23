/*const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db.js');


const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
  
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
  
    //Verificar si el encabezado tiene el formato esperado
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


CRUD LISTAR
router.get('/users2', (req, res) => {
    Realizar la lógica para obtener la lista de usuarios desde la base de datos
    db.query('SELECT id, username, email FROM users', (error, results) => {
      if (error) {
        console.error('Error al obtener la lista de usuarios:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
  
      Enviar la lista de usuarios como respuesta
      res.json({ users: results });
    });
  });






















  //Rutas relacionadas con los usuairos
// routes/users.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db.js');

//Middleware para verificar token
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
  //Rutas CRUD de usuarios
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
  //Registrar
  router.post('/signup', (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const { username, password, email } = req.body;
  
    // Validar que se proporcionen todos los campos necesarios
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    // Verificar si el usuario ya existe en la base de datos (usaremos el correo como identificador único)
    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
        console.error('Error al verificar el usuario existente:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor, ya existe' });
      }
  
      // Si ya existe un usuario con ese correo, enviar un mensaje de error
      if (results.length > 0) {
        return res.status(409).json({ message: 'El usuario ya existe' });
      }
  
      // Si no existe, proceder a registrar al nuevo usuario
      db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], (error, results) => {
        if (error) {
          console.error('Error al registrar el nuevo usuario:', error.message);
          return res.status(500).json({ message: 'Error interno del servidor no puede registrar' });
        }
  
        // Registro exitoso
        res.status(201).json({ message: 'Registro exitoso' });
      });
    });
  });

  //Login
  router.post('/login', (req, res) => {
    // Obtener las credenciales del cuerpo de la solicitud
    const { email, password } = req.body;
  
    // Validar que se proporcionen todos los campos necesarios
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    // Verificar las credenciales del usuario en la base de datos
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
      if (error) {
        console.error('Error al verificar las credenciales del usuario:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
  
      // Si las credenciales son válidas, generar un token JWT
      if (results.length > 0) {
        console.log(results)
       const user = results[0].username;
        const userId = results[0].id;
        const token = jwt.sign({ userId, email,user }, 'tu_secreto_secreto', { expiresIn: '1h' });
        res.json({ NombreUsuario:user, token: token });
      } else {
        // Credenciales inválidas
        res.status(401).json({ message: 'Credenciales inválidas' });
      }
    });
  });


  //Decodificar tokem
  router.get('/verificar-token', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
    }
  
    jwt.verify(token, 'tu_secreto_secreto', (error, decoded) => {
      if (error) {
        console.error('Error al decodificar el token:', error.message);
        return res.status(401).json({ message: 'Acceso no autorizado. Token no válido.' });
      }
  
      // El token se decodificó con éxito
      console.log('Token decodificado:', decoded);
      // Puedes acceder a la información del payload como decoded.userId, decoded.email, etc.
      res.json({ decoded });
    });
  });


// Ruta para listar todos los usuarios
router.get('/users', verifyToken, (req, res) => {
    // Realizar la lógica para obtener la lista de usuarios desde la base de datos
    db.query('SELECT id, username, email FROM users', (error, results) => {
      if (error) {
        console.error('Error al obtener la lista de usuarios:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
  
      // Enviar la lista de usuarios como respuesta
      res.json({ users: results });
    });
  });

  // Obtener información de un usuario por su ID
router.get('/users/:id', verifyToken, (req, res) => {
  const userId = req.params.id;

  // Validar que se proporcione un ID válido
  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario no válido' });
  }

  // Realizar la consulta a la base de datos para obtener la información del usuario por su ID
  db.query('SELECT id, username, email FROM users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error al obtener la información del usuario:', error.message);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Verificar si se encontró el usuario
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Devolver la información del usuario
    const user = results[0]; // Suponiendo que solo hay un usuario con ese ID
    res.json(user);
  });
});

  //Actualizar un usuario
  router.put('/users/:id', verifyToken, (req, res) => {
    const userId = req.params.id;
    const { username, email } = req.body;

    // Validar que se proporcionen todos los campos necesarios
    if (!username || !email) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el correo electrónico ya existe en la base de datos, excluyendo al usuario actual
    if (email !== req.userData.email) {
        db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error('Error al verificar el usuario existente:', error.message);
                return res.status(500).json({ message: 'Error interno del servidor, ya existe' });
            }

            // Si ya existe un usuario con ese correo, enviar un mensaje de error
            if (results.length > 0) {
                return res.status(409).json({ message: 'El correo ya existe' });
            }

            // Realizar la actualización en la base de datos
            updateUserData();
        });
    } else {
        // El usuario no está actualizando su correo electrónico, realizar la actualización directamente
        updateUserData();
    }

    function updateUserData() {
        db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId], (error, results) => {
            if (error) {
                console.error('Error al actualizar el usuario:', error.message);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            // Verificar si se actualizó correctamente
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Respuesta exitosa
            res.json({ message: 'Usuario actualizado exitosamente' });
        });
    }
});


  //Eliminar
  // Ruta para eliminar un usuario
router.delete('/users/:id', verifyToken, (req, res) => {
    const userId = req.params.id;
  
    // Realizar la eliminación en la base de datos
    db.query('DELETE FROM users WHERE id = ?', [userId], (error, results) => {
      if (error) {
        console.error('Error al eliminar el usuario:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
  
      // Verificar si se eliminó correctamente
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Respuesta exitosa
      res.json({ message: 'Usuario eliminado exitosamente' });
    });
  });

module.exports = router;
*/