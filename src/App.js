import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import CustomerDashboard from './components/Dashboard/CustomerDashboard.js';
import AgentDashboard from './components/Dashboard/AgentDashboard.js';
import AdminDashboard from './components/Dashboard/AdminDashboard.js';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/customer"
          element={
            <ProtectedRoute roles={['Customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent"
          element={
            <ProtectedRoute roles={['Agent', 'Admin']}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
