import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { getEquipmentList, deleteEquipment } from '../services/equipmentService';
import Breadcrumb from '../components/common/Breadcrumb';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import GlassTable from '../components/common/GlassTable';
import StatusBadge from '../components/common/StatusBadge';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { formatDate, formatCurrency } from '../utils/formatters';
import { exportToCSV } from '../utils/exportHelpers';

const EquipmentList = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { isAdmin, isTechnician } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState({ department: '', category: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEquipmentData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: currentPage,
        limit: 8,
        search,
        department: filters.department,
        category: filters.category,
        status: filters.status,
      }).toString();

      const res = await getEquipmentList(query);
      if (res.success) {
        setEquipment(res.equipment || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      addToast('Failed to load equipment registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipmentData();
  }, [currentPage, search, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ department: '', category: '', status: '' });
    setSearch('');
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteEquipment(deleteTarget._id);
      if (res.success) {
        addToast(`Equipment '${deleteTarget.equipmentName}' deleted`, 'success');
        fetchEquipmentData();
      } else {
        addToast(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      addToast('Error deleting equipment', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleExportCSV = () => {
    const formattedData = equipment.map((e) => ({
      'Asset ID': e.assetId,
      'Equipment Name': e.equipmentName,
      Category: e.category,
      Department: e.department,
      Manufacturer: e.manufacturer,
      Model: e.model,
      'Serial Number': e.serialNumber,
      Status: e.equipmentStatus,
      'Purchase Cost': `$${e.purchaseCost}`,
      'Warranty Expiry': formatDate(e.warrantyExpiry),
      'Next Maintenance': formatDate(e.nextMaintenance),
      Location: e.location,
    }));
    exportToCSV(formattedData, 'MedTrack_Equipment_Registry.csv');
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Equipment Registry' }]} />

      {/* Header Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Medical Equipment Registry</h2>
          <p className="text-muted small mb-0">Centralized asset tracking, maintenance status, and warranty compliance.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-glass-secondary" onClick={handleExportCSV}>
            <i className="bi bi-download me-1.5"></i> Export CSV
          </button>
          {(isAdmin || isTechnician) && (
            <Link to="/equipment/add" className="btn btn-glass-primary">
              <i className="bi bi-plus-lg me-1.5"></i> Register Equipment
            </Link>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="row g-3 mb-4">
        <div className="col-lg-12">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by Asset ID, Equipment Name, Serial Number, or Manufacturer..." />
        </div>
        <div className="col-lg-12">
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
        </div>
      </div>

      {/* Table & Content */}
      {loading ? (
        <LoadingSpinner text="Fetching equipment records..." />
      ) : equipment.length === 0 ? (
        <EmptyState
          title="No Equipment Found"
          message="No medical devices matched your filter criteria."
          action={
            (isAdmin || isTechnician) && (
              <Link to="/equipment/add" className="btn btn-glass-primary">
                Register New Device
              </Link>
            )
          }
        />
      ) : (
        <>
          <GlassTable headers={['Asset ID', 'Equipment Name', 'Category & Dept', 'Status', 'Location', 'Next Maint.', 'Actions']}>
            {equipment.map((eq) => (
              <tr key={eq._id}>
                <td>
                  <span className="fw-bold text-primary">{eq.assetId}</span>
                </td>
                <td>
                  <div className="fw-semibold">{eq.equipmentName}</div>
                  <small className="text-muted">SN: {eq.serialNumber}</small>
                </td>
                <td>
                  <div>{eq.category}</div>
                  <small className="text-muted">{eq.department}</small>
                </td>
                <td>
                  <StatusBadge status={eq.equipmentStatus} />
                </td>
                <td>
                  <i className="bi bi-geo-alt me-1 text-muted"></i>
                  {eq.location}
                </td>
                <td>{formatDate(eq.nextMaintenance)}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Link to={`/equipment/${eq._id}`} className="btn btn-sm btn-glass-secondary" title="View Lifecycle Details">
                      <i className="bi bi-eye"></i>
                    </Link>
                    {(isAdmin || isTechnician) && (
                      <Link to={`/equipment/edit/${eq._id}`} className="btn btn-sm btn-glass-secondary" title="Edit Equipment">
                        <i className="bi bi-pencil"></i>
                      </Link>
                    )}
                    {isAdmin && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(eq)} title="Delete Equipment">
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </GlassTable>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      <ConfirmationModal
        show={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Medical Equipment"
        message={`Are you sure you want to permanently delete '${deleteTarget?.equipmentName}' (${deleteTarget?.assetId})? Associated maintenance records will also be removed.`}
      />
    </div>
  );
};

export default EquipmentList;
