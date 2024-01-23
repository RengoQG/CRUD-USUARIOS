import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error('Todos los campos son obligatorios', { autoClose: 3000 });
        return;
      }

      const response = await axios.post('http://localhost:3005/api/login', {
        email: email,
        password: password,
      });

      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);

        // Mostrar el mensaje de bienvenida solo si no se ha mostrado antes en la sesión actual
        if (!localStorage.getItem('hasShownWelcome')) {
          toast.success('¡Bienvenido! Has iniciado sesión correctamente.', { autoClose: 5000 });

          // Marcar que el mensaje ya se mostró en la sesión actual
          localStorage.setItem('hasShownWelcome', 'true');
        }

        // Utiliza 'replace' en lugar de 'navigate'
        navigate('/listar', { replace: true });
      } else {
        toast.error('Respuesta del servidor no válida', { autoClose: 3000 });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Credenciales incorrectas', { autoClose: 3000 });
      } else {
        toast.error('Error en el inicio de sesión. Inténtalo de nuevo.', { autoClose: 3000 });
      }
    }
  };

  return (
    <div className='card shadow-lg p-3 mb-5 bg-white rounded'>
      <div className='card__main'>
        <h1><FontAwesomeIcon icon={faSignInAlt} /> Iniciar sesión</h1>
        <ToastContainer autoClose={5000} />
        <div className='input-group'>
          <label><FontAwesomeIcon icon={faEnvelope} /> Correo:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='input-group'>
          <label><FontAwesomeIcon icon={faLock} /> Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className='btn__login' onClick={handleLogin}>
          <FontAwesomeIcon icon={faSignInAlt} /> Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default Login;
