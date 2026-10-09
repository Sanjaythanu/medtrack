import { fetchAPI } from './api';

export const getAlertsList = async (queryParams = '') => {
  return await fetchAPI(`/alerts${queryParams ? `?${queryParams}` : ''}`);
};

export const markAlertAsRead = async (id) => {
  return await fetchAPI(`/alerts/${id}/read`, {
    method: 'PUT',
  });
};

export const markAllAlertsRead = async () => {
  return await fetchAPI('/alerts/read-all', {
    method: 'PUT',
  });
};
