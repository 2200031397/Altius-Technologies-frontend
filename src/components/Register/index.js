import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './index.css'; 

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://altius-technologies-backend-1.onrender.com/api/register', { name, email, password, role });
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      const errorMessage = error.response ? error.response.data.error : error.message;
      alert(`Error registering user: ${errorMessage}`);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          className="input-field"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="select-field"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Customer">Customer</option>
          <option value="Agent">Agent</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
