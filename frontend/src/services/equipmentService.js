import { fetchAPI } from './api';

export const getEquipmentList = async (queryParams = '') => {
  return await fetchAPI(`/equipment${queryParams ? `?${queryParams}` : ''}`);
};

export const getEquipmentById = async (id) => {
  return await fetchAPI(`/equipment/${id}`);
};

export const createEquipment = async (formData) => {
  return await fetchAPI('/equipment', {
    method: 'POST',
    body: formData, // FormData instance for image upload
  });
};

export const updateEquipment = async (id, formData) => {
  return await fetchAPI(`/equipment/${id}`, {
    method: 'PUT',
    body: formData,
  });
};

export const deleteEquipment = async (id) => {
  return await fetchAPI(`/equipment/${id}`, {
    method: 'DELETE',
  });
};
