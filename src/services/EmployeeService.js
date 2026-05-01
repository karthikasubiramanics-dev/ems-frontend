import axios from 'axios';

// Backend API URL
const REST_API_BASE_URL = 'http://localhost:8080/api/employees';

// GET all employees
export const listEmployees = () => {
    return axios.get(REST_API_BASE_URL);
};

// CREATE employee
export const createEmployee = (employee) => {
    return axios.post(REST_API_BASE_URL, employee);
};

// GET employee by ID
export const getEmployee = (employeeId) => {
    return axios.get(`${REST_API_BASE_URL}/${employeeId}`);
};

// UPDATE employee
export const updateEmployee = (employeeId, employee) => {
    return axios.put(`${REST_API_BASE_URL}/${employeeId}`, employee);
};

// DELETE employee
export const deleteEmployee = (employeeId) => {
    return axios.delete(`${REST_API_BASE_URL}/${employeeId}`);
};