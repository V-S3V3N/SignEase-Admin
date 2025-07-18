// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Signin from './pages/Signin';
import Layout from './components/Layout';
import SubscriptionPlan from './pages/SubscriptionPlan';
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const uid = localStorage.getItem("uid");
  return uid ? <Outlet /> : <Navigate to="/signin" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />

  <Route element={<PrivateRoute />}>
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/subscriptionPlan" element={<SubscriptionPlan />} />
    </Route>
  </Route>
      </Routes>
    </Router>
  );
}

export default App;
