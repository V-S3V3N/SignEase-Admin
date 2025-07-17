// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
