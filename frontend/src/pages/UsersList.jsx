import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { getUsersList, deleteUser, updateUser } from '../services/userService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassTable from '../components/common/GlassTable';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { formatDate } from '../utils/formatters';

const UsersList = () => {
  const { user: currentUser } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ search, role: roleFilter }).toString();
      const res = await getUsersList(query);
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      addToast('Error fetching user accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleToggleActive = async (u) => {
    try {
      const res = await updateUser(u._id, { isActive: !u.isActive });
      if (res.success) {
        addToast(`User ${u.fullName} ${!u.isActive ? 'activated' : 'deactivated'}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast('Failed to update user status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteUser(deleteTarget._id);
      if (res.success) {
        addToast(`User ${deleteTarget.fullName} deleted`, 'success');
        fetchUsers();
      } else {
        addToast(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      addToast('Error deleting user', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'User Access & Accounts Management' }]} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Hospital Staff & User Accounts</h2>
          <p className="text-muted small mb-0">Role-based access control management for Administrators, Bio-Med Technicians, and Staff.</p>
        </div>
        <Link to="/users/add" className="btn btn-glass-primary">
          <i className="bi bi-person-plus-fill me-1.5"></i> Create User Account
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by Full Name, Email, or Employee ID..." />
        </div>
        <div className="col-md-4">
          <select className="form-select glass-input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All System Roles</option>
            <option value="Admin">Admin</option>
            <option value="Technician">Technician</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching hospital staff directory..." />
      ) : (
        <GlassTable headers={['Employee ID', 'Full Name & Email', 'Role', 'Department', 'Last Login', 'Account Status', 'Actions']}>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="fw-bold text-primary">{u.employeeId}</td>
              <td>
                <div className="fw-semibold">{u.fullName}</div>
                <small className="text-muted">{u.email}</small>
              </td>
              <td>
                <span
                  className={`badge ${
                    u.role === 'Admin'
                      ? 'bg-primary'
                      : u.role === 'Technician'
                      ? 'bg-info text-dark'
                      : 'bg-secondary'
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td>{u.department}</td>
              <td>{formatDate(u.lastLogin)}</td>
              <td>
                <span className={`badge ${u.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {u.isActive ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-1">
                  <button
                    className={`btn btn-sm ${u.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                    onClick={() => handleToggleActive(u)}
                    title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                  >
                    <i className={`bi ${u.isActive ? 'bi-person-x' : 'bi-person-check'}`}></i>
                  </button>
                  {currentUser?._id !== u._id && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(u)} title="Delete User">
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </GlassTable>
      )}

      <ConfirmationModal
        show={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        message={`Are you sure you want to delete user '${deleteTarget?.fullName}' (${deleteTarget?.email})?`}
      />
    </div>
  );
};

export default UsersList;
