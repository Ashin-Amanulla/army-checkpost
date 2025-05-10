import axios from "../config/axios";

export const createEntry = async (data) => {
  try {
    // Special handling for FormData
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    // Let browser set the Content-Type for FormData
    // The interceptor will handle this

    const response = await axios.post("/api/vehicles", data, config);
    return response.data;
  } catch (error) {
    console.error("Error creating vehicle entry:", error);
    throw error;
  }
};

export const getEntries = async (params) => {
  try {
    const response = await axios.get("/api/vehicles", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

export const getEntry = async (id) => {
  try {
    const response = await axios.get(`/api/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    throw error;
  }
};

export const updateEntry = async (id, data) => {
  try {
    const response = await axios.put(`/api/vehicles/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw error;
  }
};

export const deleteEntry = async (id) => {
  try {
    const response = await axios.delete(`/api/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};

export const updateVehicle = async (id, data) => {
  try {
    const response = await axios.patch(`/api/vehicles/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const entries = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  updateVehicle,
};
