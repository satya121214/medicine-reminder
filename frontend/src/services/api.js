import axios from "axios";

const API_BASE = "http://localhost:8080/api/reminders";

export const getReminders = () => axios.get(API_BASE);
export const addReminder = (data) => axios.post(API_BASE, data);
export const deleteReminder = (id) => axios.delete(`${API_BASE}/${id}`);
export const updateReminder = (id, data) => axios.put(`${API_BASE}/${id}`, data);
