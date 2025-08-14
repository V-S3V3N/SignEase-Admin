import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Signin from './pages/Signin';
import Layout from './components/Layout';
import SubscriptionPlan from './pages/SubscriptionPlan';
import Course from './pages/Course';
import UserManagement from './pages/UserManagement';
import Report from './pages/Report';

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
      <Route path="/course" element={<Course />} />
      {/* <Route path="/userManagement" element={<UserManagement />} /> */}
      <Route path="/report" element={<Report />} />
    </Route>
  </Route>
      </Routes>
    </Router>
  );
}

export default App;
