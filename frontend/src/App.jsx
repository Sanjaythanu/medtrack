import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleProtectedRoute from './components/layout/RoleProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/EquipmentList';
import EquipmentDetails from './pages/EquipmentDetails';
import AddEquipment from './pages/AddEquipment';
import EditEquipment from './pages/EditEquipment';
import MaintenanceList from './pages/MaintenanceList';
import ScheduleMaintenance from './pages/ScheduleMaintenance';
import MaintenanceDetails from './pages/MaintenanceDetails';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import UsersList from './pages/UsersList';
import AddUser from './pages/AddUser';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';

const App = () => {
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/unauthorized', '/forbidden', '/404'].includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      {/* Background Ambient Blobs */}
      <div className="bg-blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {!isPublicPage ? (
        <>
          <Sidebar showMobile={showSidebarMobile} onCloseMobile={() => setShowSidebarMobile(false)} />
          <Navbar onToggleSidebar={() => setShowSidebarMobile(!showSidebarMobile)} />
          <main className="main-content flex-grow-1">
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/equipment" element={<EquipmentList />} />
                <Route path="/equipment/:id" element={<EquipmentDetails />} />
                
                <Route element={<RoleProtectedRoute allowedRoles={['Admin', 'Technician']} />}>
                  <Route path="/equipment/add" element={<AddEquipment />} />
                  <Route path="/equipment/edit/:id" element={<EditEquipment />} />
                  <Route path="/maintenance/schedule" element={<ScheduleMaintenance />} />
                </Route>

                <Route path="/maintenance" element={<MaintenanceList />} />
                <Route path="/maintenance/:id" element={<MaintenanceDetails />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/alerts" element={<Alerts />} />

                <Route element={<RoleProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/users" element={<UsersList />} />
                  <Route path="/users/add" element={<AddUser />} />
                </Route>

                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
