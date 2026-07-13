import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// import DashboardHome from './pages/DashboardHome';
import ApplyLeave from './pages/ApplyLeave';
import LeaveRequest from './pages/LeaveRequest';
import MyLeaves from './pages/MyLeave';
import ProtectedRoute from './components/ProtectedRoutes';
import RegisterEmployee from './pages/RegisterEmployee';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      
      {/* Protect the entire Dashboard route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element  element={<ApplyLeave />} />
          <Route path="requests" element={<LeaveRequest />} />
          <Route path="my-leaves" element={<MyLeaves />} />
          {/* New Admin Route */}
    <Route path="register-employee" element={<RegisterEmployee />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;