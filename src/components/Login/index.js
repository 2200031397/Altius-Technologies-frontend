import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Make sure to install js-cookie

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3000/api/login', { email, password });
        Cookies.set('authToken', response.data.token, { expires: 1 });
        const userRole = response.data.user.role;
        if (userRole === 'Customer') navigate('/customer');
        if (userRole === 'Agent') navigate('/agent');
        if (userRole === 'Admin') navigate('/admin');
      } catch (error) {
        console.error('Login error:', error.response || error.message);
        alert('Invalid email or password');
      }
    };
    

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  );
}

export default LoginPage;
