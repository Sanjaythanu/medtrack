import React from 'react';
import GlassCard from '../common/GlassCard';

const CalendarWidget = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const today = currentDate.getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Simulated scheduled maintenance dates
  const scheduledDays = [3, 10, 15, 22, 28];

  return (
    <GlassCard title={`Maintenance Calendar (${currentMonth})`} icon="bi-calendar3">
      <div className="text-center mb-3">
        <div className="row row-cols-7 g-1 fw-semibold text-muted small mb-2">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        <div className="row row-cols-7 g-1">
          {days.map((day) => {
            const isToday = day === today;
            const isScheduled = scheduledDays.includes(day);
            return (
              <div key={day} className="col p-1">
                <div
                  className={`p-2 rounded-3 fs-7 fw-medium transition-all ${
                    isToday
                      ? 'bg-primary text-white shadow'
                      : isScheduled
                      ? 'bg-warning bg-opacity-25 text-warning border border-warning'
                      : 'glass-panel hover-bg-light'
                  }`}
                  style={{ cursor: 'pointer' }}
                  title={isScheduled ? `Scheduled Maintenance on Day ${day}` : ''}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="d-flex justify-content-center gap-3 small text-muted border-top pt-2">
        <span className="d-flex align-items-center gap-1">
          <span className="d-inline-block rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></span> Today
        </span>
        <span className="d-flex align-items-center gap-1">
          <span className="d-inline-block rounded-circle bg-warning" style={{ width: '8px', height: '8px' }}></span> Maintenance Due
        </span>
      </div>
    </GlassCard>
  );
};

export default CalendarWidget;
