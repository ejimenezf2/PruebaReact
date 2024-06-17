import React from 'react'
import Dashboard from './Dashboard'
import Login from '../Login/login'

function parseJwt (tokenCreado) {
    const base64Url = tokenCreado.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

let tokenExistAndStillValid = (parseJwt(localStorage.getItem('tokenCreado')).exp * 1000 > Date.now());

export default function inicio() {
  return (
    <>{tokenExistAndStillValid ? <Dashboard /> : <Login /> }</>
  )
}
