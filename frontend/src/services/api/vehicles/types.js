import axios from '../config/axios';

export const getAll = async () => {
  try {
    const response = await axios.get('/api/vehicletypes');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
    throw error;
  }
};

export const create = async (data) => {
  try {
    const response = await axios.post('/api/vehicletypes', data);
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle type:', error);
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`/api/vehicletypes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle type:', error);
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/api/vehicletypes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle type:', error);
    throw error;
  }
}; 