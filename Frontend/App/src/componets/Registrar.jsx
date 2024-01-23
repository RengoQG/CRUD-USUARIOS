// Registro.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Asegúrate de que la ruta sea correcta 

const Registro = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const isEmailValid = (email) => {
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    try {
      // Validar campos obligatorios
      if (!username || !password || !email) {
        toast.error('Todos los campos son obligatorios', { autoClose: 3000 });
        return;
      }

      // Validar el formato del correo electrónico
      if (!isEmailValid(email)) {
        toast.error('El correo electrónico no tiene un formato válido', { autoClose: 3000 });
        return;
      }

      // Enviar la solicitud para registrar al nuevo usuario
      const response = await axios.post('http://localhost:3005/api/signup', {
        username: username,
        password: password,
        email: email,
      });

      // Manejar la respuesta del servidor
      if (response && response.data && response.data.message) {
        toast.success(response.data.message, { autoClose: 3000 });
        
        // Limpiar los campos después de un registro exitoso
        setUsername('');
        setPassword('');
        setEmail('');
        
        // Puedes redirigir al usuario a otra página o realizar alguna acción después del registro exitoso
      } else {
        toast.error('Respuesta del servidor no válida', { autoClose: 3000 });
      }
    } catch (error) {
      // Manejar errores específicos
      if (error.response && error.response.status === 409) {
        toast.error('El usuario ya existe', { autoClose: 3000 });
      } else {
        toast.error('Error en el registro. Inténtalo de nuevo.', { autoClose: 3000 });
      }
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Registro de Usuario</h2>
      <ToastContainer autoClose={5000} />
  
      <div className="input-group">
        <label>Nombre de Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
      </div>
  
      <div className="input-group">
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
      </div>
  
      <div className="input-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
      </div>
  
      <button onClick={handleRegister} className="register-button">
        Registrarse
      </button>
  
      <button onClick={() => navigate('/listar')} className="back-button">
        <FontAwesomeIcon icon={faHome} />
        Volver al listado de usuarios
      </button>
    </div>
  );
};

export default Registro;
