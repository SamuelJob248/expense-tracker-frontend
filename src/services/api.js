import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getExpenses = (params = {}) => {
  return apiClient.get('/expenses/', { params });
};
export const addExpense = (expenseData) => {
  return apiClient.post('/expenses/', expenseData);
};
export const deleteExpense = (id) => {
  return apiClient.delete(`/expenses/${id}/`);
};
export const updateExpense = (id, expenseData) => {
  return apiClient.patch(`/expenses/${id}/`, expenseData);
};
export const getSummary = () => {
  return apiClient.get('/summary/');
};

