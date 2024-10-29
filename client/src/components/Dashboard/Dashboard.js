import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';
import ManagerDashboard from './ManagerDashboard';
import UserDashboard from './UserDashboard';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = () => {
  const { authState } = useContext(AuthContext);

  switch (authState.user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'client':
      return <ClientDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default Dashboard;
