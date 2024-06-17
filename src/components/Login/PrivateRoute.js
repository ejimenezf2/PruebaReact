import React from 'react';
import { Navigate } from 'react-router-dom';

// Función para decodificar el token JWT
function parseJwt(tokenCreado) {
    const base64Url = tokenCreado.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('tokenCreado');
  const tokenIsValid = token && parseJwt(token).exp * 1000 > Date.now();
  return tokenIsValid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
