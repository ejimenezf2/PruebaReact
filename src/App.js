import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/login';
import AdminLayout from './components/Layouts/AdminLayout';
import Dashboard from './components/Sistema/Dashboard';
import Empleado from './components/Sistema/Empleado';
import Vacuna from './components/Sistema/Vacunas';
import PrivateRoute from './components/Login/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/empleado/*"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Empleado />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/vacuna/*"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Vacuna />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
