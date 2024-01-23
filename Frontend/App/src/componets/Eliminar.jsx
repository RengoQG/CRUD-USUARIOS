import React from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';


const EliminarUsuario = ({ userId, onDeleteSuccess }) => {
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      await axios.delete(`http://localhost:3005/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Eliminado correctamente', { autoClose: 3000 });

      // Llamar a la función proporcionada para actualizar la lista de usuarios
      onDeleteSuccess();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error.message);
    }
  };

  return (
    <button className='btn__eliminar' onClick={handleDeleteUser}>
      <FontAwesomeIcon icon={faTrash} />
      Eliminar
    </button>
  );
};

export default EliminarUsuario;
