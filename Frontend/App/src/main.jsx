import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css'
import Login from './componets/login.jsx'
import ListaUsuarios from './componets/ListaUsuarios.jsx';
import ProtectedRoute from './componets/ProtectedRoute.jsx';
import Registrar from './componets/Registrar.jsx';
import Actualizar from './componets/actualizar.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/listar" element={<ProtectedRoute><ListaUsuarios /></ProtectedRoute>} />
      <Route path="/agregar" element={<ProtectedRoute><Registrar /></ProtectedRoute>} />
      <Route path="/editar/:id" element={<ProtectedRoute><Actualizar /></ProtectedRoute>} />
    </Routes>
  </Router>
</React.StrictMode>
)
