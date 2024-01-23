import React from 'react';
import { useNavigate } from 'react-router-dom';

const CerrarSesion = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token');

    // Actualizar welcomeMessage para que se muestre el mensaje al cerrar sesión
    localStorage.removeItem('welcomeMessage');

    // Llamar a la función de logout si se proporciona
    if (onLogout) {
      onLogout();
    }

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/');
  };

  return (
    <button onClick={handleCerrarSesion}>
      Cerrar Sesión
    </button>
  );
};

export default CerrarSesion;
