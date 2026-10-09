import React from 'react';
import GlassCard from '../common/GlassCard';
import { formatCurrency } from '../../utils/formatters';
import useCountUp from '../../hooks/useCountUp';

const StatCard = ({ st, idx }) => {
  const animatedValue = useCountUp(st.rawVal);

  return (
    <div
      className="col-12 col-sm-6 col-lg-3 fade-in-up"
      style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
    >
      <GlassCard className="h-100 p-3.5 position-relative overflow-hidden stat-card-interactive">
        <div className="d-flex align-items-center justify-content-between mb-3">
          {/* Gradient Rounded-Square Badge */}
          <div
            className="stat-icon-badge d-flex align-items-center justify-content-center"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: st.badgeGradient,
              boxShadow: `0 4px 14px ${st.shadowColor}`,
              color: '#ffffff',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <i className={`bi ${st.icon} fs-4`}></i>
          </div>

          <span
            className="badge px-2.5 py-1.5 rounded-pill fw-semibold extra-small"
            style={{
              backgroundColor: st.bgTint,
              color: st.textColor,
              border: `1px solid ${st.borderColor}`,
            }}
          >
            {st.badge}
          </span>
        </div>

        {/* Hero Metric Number */}
        <div
          className="fw-bold mb-1 tracking-tight text-primary"
          style={{ fontSize: '2.1rem', lineHeight: 1.15, letterSpacing: '-0.03em' }}
        >
          {animatedValue}
        </div>

        <div className="text-muted small fw-medium">{st.title}</div>

        {/* Animated Bottom Status Bar */}
        <div
          className="position-absolute bottom-0 start-0"
          style={{
            height: '3px',
            background: st.barGradient,
            animation: 'fillLeftToRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            borderRadius: '0 0 20px 20px',
          }}
        ></div>
      </GlassCard>
    </div>
  );
};

const QuickStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Asset Value',
      rawVal: formatCurrency(stats?.totalAssetValue || 0),
      icon: 'bi-bank',
      badge: 'Portfolio Capital',
      badgeGradient: 'linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)',
      barGradient: 'linear-gradient(90deg, #4F7CFF 0%, #8B5CF6 100%)',
      shadowColor: 'rgba(79, 124, 255, 0.3)',
      bgTint: 'rgba(79, 124, 255, 0.12)',
      textColor: 'var(--accent-color)',
      borderColor: 'rgba(79, 124, 255, 0.25)',
    },
    {
      title: 'Total Equipment',
      rawVal: stats?.totalEquipment || 0,
      icon: 'bi-hospital-fill',
      badge: 'All Assets',
      badgeGradient: 'linear-gradient(135deg, #3B82F6 0%, #4F7CFF 100%)',
      barGradient: 'linear-gradient(90deg, #3B82F6 0%, #4F7CFF 100%)',
      shadowColor: 'rgba(59, 130, 246, 0.3)',
      bgTint: 'rgba(59, 130, 246, 0.12)',
      textColor: '#3B82F6',
      borderColor: 'rgba(59, 130, 246, 0.25)',
    },
    {
      title: 'Healthy Devices',
      rawVal: stats?.healthyEquipment || 0,
      icon: 'bi-shield-check',
      badge: 'Operational',
      badgeGradient: 'linear-gradient(135deg, #00C897 0%, #00E6AC 100%)',
      barGradient: 'linear-gradient(90deg, #00C897 0%, #00E6AC 100%)',
      shadowColor: 'rgba(0, 200, 151, 0.3)',
      bgTint: 'var(--status-healthy-bg)',
      textColor: 'var(--status-healthy)',
      borderColor: 'rgba(0, 200, 151, 0.3)',
    },
    {
      title: 'Maintenance Due Soon',
      rawVal: stats?.dueSoonEquipment || 0,
      icon: 'bi-clock-history',
      badge: '< 7 Days',
      badgeGradient: 'linear-gradient(135deg, #F4B400 0%, #F7C948 100%)',
      barGradient: 'linear-gradient(90deg, #F4B400 0%, #F7C948 100%)',
      shadowColor: 'rgba(244, 180, 0, 0.3)',
      bgTint: 'var(--status-due-soon-bg)',
      textColor: 'var(--status-due-soon)',
      borderColor: 'rgba(244, 180, 0, 0.3)',
    },
    {
      title: 'Critical & Overdue',
      rawVal: (stats?.criticalEquipment || 0) + (stats?.overdueEquipment || 0),
      icon: 'bi-exclamation-octagon-fill',
      badge: 'Action Needed',
      badgeGradient: 'linear-gradient(135deg, #FF4D4F 0%, #C1121F 100%)',
      barGradient: 'linear-gradient(90deg, #FF4D4F 0%, #C1121F 100%)',
      shadowColor: 'rgba(255, 77, 79, 0.35)',
      bgTint: 'var(--status-overdue-bg)',
      textColor: 'var(--status-overdue)',
      borderColor: 'rgba(255, 77, 79, 0.3)',
    },
    {
      title: 'Completion Rate',
      rawVal: `${stats?.maintenanceCompletionRate || 100}%`,
      icon: 'bi-check2-all',
      badge: 'Work Order SLA',
      badgeGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      barGradient: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
      shadowColor: 'rgba(16, 185, 129, 0.3)',
      bgTint: 'rgba(16, 185, 129, 0.14)',
      textColor: '#10B981',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'Average Repair Cost',
      rawVal: formatCurrency(stats?.averageRepairCost || 0),
      icon: 'bi-calculator',
      badge: 'Per Maintenance',
      badgeGradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      barGradient: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
      shadowColor: 'rgba(139, 92, 246, 0.3)',
      bgTint: 'rgba(139, 92, 246, 0.14)',
      textColor: '#8B5CF6',
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    {
      title: 'Active Downtime',
      rawVal: `${stats?.equipmentDowntime || 0} Assets`,
      icon: 'bi-tools',
      badge: 'Out of Service',
      badgeGradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      barGradient: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
      shadowColor: 'rgba(239, 68, 68, 0.35)',
      bgTint: 'rgba(239, 68, 68, 0.14)',
      textColor: '#EF4444',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {statCards.map((st, idx) => (
        <StatCard key={idx} st={st} idx={idx} />
      ))}
    </div>
  );
};

export default QuickStats;
