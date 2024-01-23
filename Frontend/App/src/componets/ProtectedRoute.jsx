// ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = () => {
      // Verificar si hay un token en el almacenamiento local (ajustar según la lógica de autenticación)
      const token = localStorage.getItem('token');

      // Mostrar el token en la consola al cargar el componente
      console.log('Token en consola:', token);

      return token !== null;
    };

    // Verificar la autenticación al cargar el componente
    if (!isAuthenticated()) {
      // Redirigir a la página de inicio de sesión si no está autenticado
      navigate('/');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
