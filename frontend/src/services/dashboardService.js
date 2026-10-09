import { fetchAPI } from './api';

export const getDashboardData = async () => {
  return await fetchAPI('/dashboard');
};
