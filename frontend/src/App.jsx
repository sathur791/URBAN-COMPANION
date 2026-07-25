import { useState, useEffect } from 'react';
import { auth } from './api';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;
  return <Dashboard onLogout={handleLogout} />;
}

export default App;
