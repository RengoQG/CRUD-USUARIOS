import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ActualizarUsuario = () => {
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
          console.error('No hay token disponible');
          return;
        }

        setToken(storedToken);

        const response = await axios.get(`http://localhost:3005/api/listar-usuario/${id}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const userData = response.data;

        setUsername(userData.username);
        setEmail(userData.email);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error.message);
      }
    };

    fetchUserData();
  }, [id]);

  const isValidEmail = (email) => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateUser = async () => {
    try {
      if (!username || !email) {
        console.error('Todos los campos son obligatorios');
        toast.error('Todos los campos son obligatorios', { autoClose: 3000 });
        return;
      }

      if (!isValidEmail(email)) {
        console.error('El correo electrónico no tiene un formato válido');
        toast.error('El correo electrónico no tiene un formato válido', { autoClose: 3000 });
        return;
      }

      const response = await axios.put(`http://localhost:3005/api/users/${id}`, {
        username: username,
        email: email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data && response.data.message) {
        console.log(response.data.message);
        toast.success(response.data.message, { autoClose: 3000 });
        navigate('/listar');
      } else {
        console.error('Respuesta del servidor no válida');
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error.message);
    }
  };

  return (
    <div className="edit-user-container">
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
        <label>Correo Electrónico:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
      </div>

      <button onClick={handleUpdateUser} className="update-user-button">
        Actualizar Usuario
      </button>

      <button onClick={() => navigate('/listar')} className="back-button">
        <FontAwesomeIcon icon={faHome} />
        Volver al listado de usuarios
      </button>
    </div>
  );
};

export default ActualizarUsuario;
