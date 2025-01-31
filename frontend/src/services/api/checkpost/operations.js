import axios from '../config/axios';

export const getAll = async () => {
  try {
    const response = await axios.get('/api/checkposts');
    return response.data;
  } catch (error) {
    console.error('Error fetching checkposts:', error);
    throw error;
  }
};

export const create = async (data) => {
  try {
    const response = await axios.post('/api/checkposts', data);
    return response.data;
  } catch (error) {
    console.error('Error creating checkpost:', error);
    throw error;
  }
};

export const update = async (id, data) => {
  try {
    const response = await axios.put(`/api/checkposts/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating checkpost:', error);
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const response = await axios.delete(`/api/checkposts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting checkpost:', error);
    throw error;
  }
}; 