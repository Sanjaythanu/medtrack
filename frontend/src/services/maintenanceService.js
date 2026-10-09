import { fetchAPI } from './api';

export const getMaintenanceList = async (queryParams = '') => {
  return await fetchAPI(`/maintenance${queryParams ? `?${queryParams}` : ''}`);
};

export const getMaintenanceById = async (id) => {
  return await fetchAPI(`/maintenance/${id}`);
};

export const scheduleMaintenance = async (formData) => {
  return await fetchAPI('/maintenance', {
    method: 'POST',
    body: formData,
  });
};

export const updateMaintenance = async (id, formData) => {
  return await fetchAPI(`/maintenance/${id}`, {
    method: 'PUT',
    body: formData,
  });
};

export const deleteMaintenance = async (id) => {
  return await fetchAPI(`/maintenance/${id}`, {
    method: 'DELETE',
  });
};
