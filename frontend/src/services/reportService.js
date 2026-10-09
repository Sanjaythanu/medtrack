import { fetchAPI } from './api';

export const getReportsList = async () => {
  return await fetchAPI('/reports');
};

export const generateReport = async (reportData) => {
  return await fetchAPI('/reports/generate', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
};
