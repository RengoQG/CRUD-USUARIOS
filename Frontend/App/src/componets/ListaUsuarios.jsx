import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import EliminarUsuario from './Eliminar'; // Ajusta la ruta según la ubicación real de tu componente
import CerrarSesion from './CerrarSesion'; // Ajusta la ruta según la ubicación real de tu componente

const ListaUsuarios = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No hay token disponible');
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:3005/api/usersT', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!welcomeMessage) {
          // Mostrar el mensaje de bienvenida
          setWelcomeMessage('Inicio de sesión exitoso');

          // Actualizar welcomeMessage a false después de mostrar el mensaje
          setWelcomeMessage(false);

          // Guardar welcomeMessage en el localStorage
          localStorage.setItem('welcomeMessage', 'false');
        }

        setUsers(response.data.users);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error.message);
        if (!welcomeMessage) {
          setWelcomeMessage('Error al obtener la lista de usuarios');
        }
      }
    };

    fetchUsers();
  }, [welcomeMessage, navigate]);

  useEffect(() => {
    if (welcomeMessage) {
      toast.success(welcomeMessage, { autoClose: 1500 });

      // Resetear welcomeMessage y actualizar en el localStorage
      setWelcomeMessage(false);
      localStorage.setItem('welcomeMessage', 'false');
    }
  }, [welcomeMessage]);

  const handleUpdateUser = (userId) => {
    navigate(`/editar/${userId}`);
  };

  const handleDeleteSuccess = () => {
    // Puedes realizar acciones adicionales después de la eliminación exitosa
    // Por ejemplo, volver a cargar la lista de usuarios
    fetchUsers(); // Asegúrate de tener una función para obtener la lista de usuarios
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No hay token disponible');
        navigate('/');
        return;
      }

      const response = await axios.get('http://localhost:3005/api/usersT', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!welcomeMessage) {
        // Mostrar el mensaje de bienvenida
        setWelcomeMessage('Inicio de sesión exitoso');

        // Actualizar welcomeMessage a false después de mostrar el mensaje
        setWelcomeMessage(false);

        // Guardar welcomeMessage en el localStorage
        localStorage.setItem('welcomeMessage', 'false');
      }

      setUsers(response.data.users);
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error.message);
      if (!welcomeMessage) {
        setWelcomeMessage('Error al obtener la lista de usuarios');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <ToastContainer autoClose={5000} />
      <h2>Lista de Usuarios</h2>
      <button onClick={() => navigate('/agregar')}>
        <FontAwesomeIcon icon={faPlus} />
        Agregar Usuario
      </button>
      <CerrarSesion onLogout={handleLogout} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button className='btn__edit' onClick={() => handleUpdateUser(user.id)}>
                  <FaEdit /> Editar
                </button>
                <EliminarUsuario userId={user.id} onDeleteSuccess={handleDeleteSuccess} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaUsuarios;
