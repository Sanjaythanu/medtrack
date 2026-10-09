import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { generateReport } from '../services/reportService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';
import GlassTable from '../components/common/GlassTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatCurrency } from '../utils/formatters';
import { exportToCSV } from '../utils/exportHelpers';

const Reports = () => {
  const { addToast } = useContext(NotificationContext);

  const [reportType, setReportType] = useState('Equipment');
  const [reportName, setReportName] = useState('Medical Equipment Inventory Report');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');

  const [loading, setLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await generateReport({
        reportName,
        reportType,
        filters: { department, status },
      });

      if (res.success) {
        setReportResult(res.data);
        addToast('Report generated successfully!', 'success');
      } else {
        addToast(res.message || 'Report generation failed', 'error');
      }
    } catch (err) {
      addToast('An error occurred during report generation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportResult || !reportResult.data || !reportResult.data.length) {
      addToast('No data available to export', 'warning');
      return;
    }
    exportToCSV(reportResult.data, `${reportType}_Report.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'System Reports & Analytics' }]} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Hospital Reports Generator</h2>
          <p className="text-muted small mb-0">Generate, analyze, and export bio-medical device reports, maintenance costs, and technician workloads.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <GlassCard title="Report Configuration" icon="bi-sliders">
            <form onSubmit={handleGenerate}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Report Type</label>
                <select
                  className="form-select glass-input"
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setReportName(`${e.target.value} Summary Report`);
                  }}
                >
                  <option value="Equipment">Complete Equipment Inventory</option>
                  <option value="Maintenance">Maintenance Operations & Logs</option>
                  <option value="Warranty">Expiring & Expired Warranties</option>
                  <option value="CriticalEquipment">Critical & Overdue Devices</option>
                  <option value="Cost">Maintenance Expense Analysis</option>
                  <option value="Technician">Technician Workload & Performance</option>
                  <option value="Department">Department Assets Distribution</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Report Title</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Filter by Department</label>
                <select className="form-select glass-input" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">All Departments</option>
                  <option value="Radiology & Imaging">Radiology & Imaging</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                  <option value="General & Robotic Surgery">General & Robotic Surgery</option>
                  <option value="Emergency & Trauma">Emergency & Trauma</option>
                </select>
              </div>

              <button type="submit" className="btn btn-glass-primary w-100 py-2.5" disabled={loading}>
                {loading ? 'Generating...' : 'Compile & Generate Report'}
              </button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          {loading ? (
            <LoadingSpinner text="Compiling report data..." />
          ) : !reportResult ? (
            <GlassCard className="text-center p-5">
              <i className="bi bi-file-earmark-bar-graph text-primary fs-1 mb-3 d-block"></i>
              <h5 className="fw-bold">No Report Generated Yet</h5>
              <p className="text-muted small">Select report criteria on the left and click 'Compile & Generate Report'.</p>
            </GlassCard>
          ) : (
            <GlassCard
              title={reportResult.title || reportName}
              icon="bi-file-earmark-text"
              action={
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-glass-secondary" onClick={handleExportCSV}>
                    <i className="bi bi-download me-1"></i> Export CSV
                  </button>
                  <button className="btn btn-sm btn-outline-primary" onClick={handlePrint}>
                    <i className="bi bi-printer me-1"></i> Print
                  </button>
                </div>
              }
            >
              <div className="mb-3 p-3 glass-panel d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small">Total Records Returned:</span>
                  <span className="fw-bold ms-2 text-primary fs-5">{reportResult.totalItems || reportResult.totalRecords || reportResult.data?.length || 0}</span>
                </div>
                {reportResult.totalMaintenanceCost !== undefined && (
                  <div>
                    <span className="text-muted small">Total Expense:</span>
                    <span className="fw-bold ms-2 text-success fs-5">{formatCurrency(reportResult.totalMaintenanceCost)}</span>
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="table-responsive">
                <table className="glass-table">
                  <thead>
                    <tr>
                      {reportType === 'Technician' ? (
                        <>
                          <th>Technician Name</th>
                          <th>Email</th>
                          <th>Assigned Devices</th>
                          <th>Pending Maint.</th>
                          <th>Completed Maint.</th>
                        </>
                      ) : reportType === 'Department' ? (
                        <>
                          <th>Department Name</th>
                          <th>Equipment Count</th>
                          <th>Healthy Devices</th>
                          <th>Critical Devices</th>
                        </>
                      ) : (
                        <>
                          <th>Asset ID / ID</th>
                          <th>Name / Description</th>
                          <th>Department / Status</th>
                          <th>Date / Info</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {reportResult.data && reportResult.data.map((row, idx) => (
                      <tr key={idx}>
                        {reportType === 'Technician' ? (
                          <>
                            <td className="fw-bold">{row.technician?.fullName}</td>
                            <td>{row.technician?.email}</td>
                            <td>{row.assignedEquipmentCount}</td>
                            <td>{row.pendingMaintenanceCount}</td>
                            <td>{row.completedMaintenanceCount}</td>
                          </>
                        ) : reportType === 'Department' ? (
                          <>
                            <td className="fw-bold">{row._id}</td>
                            <td>{row.totalEquipment}</td>
                            <td className="text-success fw-bold">{row.healthyCount}</td>
                            <td className="text-danger fw-bold">{row.criticalCount}</td>
                          </>
                        ) : (
                          <>
                            <td className="fw-bold text-primary">{row.assetId || row.maintenanceId || `#${idx + 1}`}</td>
                            <td>{row.equipmentName || row.equipmentId?.equipmentName || 'Record'}</td>
                            <td>{row.department || row.status || 'N/A'}</td>
                            <td>{formatDate(row.nextMaintenance || row.scheduledDate || row.createdAt)}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
