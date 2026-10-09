import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getDashboardData } from '../services/dashboardService';
import QuickStats from '../components/dashboard/QuickStats';
import HealthChart from '../components/dashboard/HealthChart';
import DepartmentChart from '../components/dashboard/DepartmentChart';
import MaintenanceTrendChart from '../components/dashboard/MaintenanceTrendChart';
import UpcomingMaintenanceWidget from '../components/dashboard/UpcomingMaintenanceWidget';
import TopServicedWidget from '../components/dashboard/TopServicedWidget';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user, isAdmin, isTechnician } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardData();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling hospital metrics & analytics..." />;
  }

  return (
    <div className="page-transition">
      {/* Welcome Banner */}
      <div
        className="glass-panel p-4 p-md-5 mb-4 position-relative overflow-hidden"
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(79, 124, 255, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(79, 124, 255, 0.25)',
        }}
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span
              className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold d-inline-flex align-items-center gap-1.5"
              style={{
                backgroundColor: 'rgba(79, 124, 255, 0.18)',
                color: 'var(--accent-color)',
                border: '1px solid rgba(79, 124, 255, 0.3)',
              }}
            >
              <i className="bi bi-hospital"></i> Hospital Operations Command Center
            </span>
            <h2 className="display-6 fw-extrabold text-primary mb-2">
              Welcome back, {user?.fullName || 'Administrator'} 👋
            </h2>
            <p className="text-muted mb-4 max-w-xl fs-6" style={{ lineHeight: 1.6 }}>
              MedTrack dynamic status engine active. Overview of medical devices, bio-medical maintenance schedules, background scheduler engine, and department asset health.
            </p>
            <div className="d-flex flex-wrap gap-2.5">
              {(isAdmin || isTechnician) && (
                <Link to="/equipment/add" className="btn btn-glass-primary">
                  <i className="bi bi-plus-circle me-1.5"></i> Add New Equipment
                </Link>
              )}
              {(isAdmin || isTechnician) && (
                <Link to="/maintenance/schedule" className="btn btn-glass-secondary">
                  <i className="bi bi-tools me-1.5"></i> Schedule Maintenance
                </Link>
              )}
              <Link to="/reports" className="btn btn-glass-ghost border border-white-10">
                <i className="bi bi-file-earmark-bar-graph me-1.5"></i> Reports Center
              </Link>
            </div>
          </div>
          <div className="col-lg-4 text-center d-none d-lg-block">
            <div
              className="rounded-circle text-white shadow-lg mx-auto d-inline-flex align-items-center justify-content-center"
              style={{
                width: '120px',
                height: '120px',
                background: 'var(--accent-gradient)',
                boxShadow: '0 10px 30px rgba(79, 124, 255, 0.35)',
              }}
            >
              <i className="bi bi-heart-pulse fs-1"></i>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <QuickStats stats={data?.stats} />

      {/* Main Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <HealthChart data={data?.analytics?.healthDistribution} />
        </div>
        <div className="col-lg-4">
          <DepartmentChart departmentStats={data?.analytics?.departmentStats} />
        </div>
        <div className="col-lg-4">
          <MaintenanceTrendChart monthlyTrend={data?.analytics?.monthlyMaintenanceTrend} />
        </div>
      </div>

      {/* Top Serviced & Upcoming Maintenance Widgets */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <TopServicedWidget items={data?.analytics?.topServicedEquipment} />
        </div>
        <div className="col-lg-6">
          <UpcomingMaintenanceWidget items={data?.recentData?.upcomingMaintenance} />
        </div>
      </div>

      {/* Calendar & Activity Timeline */}
      <div className="row g-4">
        <div className="col-lg-6">
          <CalendarWidget />
        </div>
        <div className="col-lg-6">
          <ActivityTimeline activities={data?.recentData?.recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
