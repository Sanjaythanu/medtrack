import { fetchAPI } from './api';

export const getUsersList = async (queryParams = '') => {
  return await fetchAPI(`/users${queryParams ? `?${queryParams}` : ''}`);
};

export const getUserById = async (id) => {
  return await fetchAPI(`/users/${id}`);
};

export const createUser = async (userData) => {
  return await fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (id, userData) => {
  return await fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (id) => {
  return await fetchAPI(`/users/${id}`, {
    method: 'DELETE',
  });
};
