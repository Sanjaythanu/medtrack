import { fetchAPI } from './api';

export const loginUser = async (email, password) => {
  return await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = async (userData) => {
  return await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const logoutUser = async () => {
  return await fetchAPI('/auth/logout', { method: 'POST' });
};

export const getMe = async () => {
  return await fetchAPI('/auth/me', { method: 'GET' });
};
