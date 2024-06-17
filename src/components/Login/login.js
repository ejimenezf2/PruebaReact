import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css'; // Importa el módulo CSS

// Función para decodificar el token JWT
function parseJwt(tokenCreado) {
    const base64Url = tokenCreado.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un token válido en el localStorage al cargar el componente
    const token = localStorage.getItem('tokenCreado');
    if (token && parseJwt(token).exp * 1000 > Date.now()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      correo: email,
      password: password,
    };

    fetch('http://localhost:5211/api/Autenticacion/Validar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.tokenCreado) {
          localStorage.setItem('tokenCreado', result.tokenCreado); // Usar 'tokenCreado' para guardar el token
          navigate('/dashboard');
        } else {
          setError('Usuario o contraseña incorrectos');
        }
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        setError('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      });
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h2>Login</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
