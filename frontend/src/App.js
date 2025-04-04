import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Register from './Register';
import UserManagement from './UserManagement';
import ApiKeys from './ApiKeys';
import Layout from './Layout';
import { jwtDecode } from 'jwt-decode'; 

const App = () => {
  const savedToken = localStorage.getItem('token');
  const [token, setToken] = useState(savedToken); 
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');  

  useEffect(() => {
    if(token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
      setRole(decodedToken.role);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); 
  };

  return (
    <Router> 
      <Routes>
        {!token ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<Layout handleLogout={handleLogout} username= {username} role={role} />}>
              <Route index element={<Home />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="api-keys" element={<ApiKeys />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
