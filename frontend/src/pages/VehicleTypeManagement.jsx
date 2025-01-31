import { useState, useEffect } from "react";
import {
  DirectionsCar,
  Add,
  Edit,
  Delete,
  ViewList,
  GridView,
} from "@mui/icons-material";
import { vehicleAPI } from "../services/api";
import {
  PageHeader,
  Card,
  Button,
  DataTable,
  Modal,
  LoadingSpinner,
} from "../components/ui";
import toast from "react-hot-toast";

function VehicleTypeManagement() {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true
  });

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = async () => {
    try {
      setLoading(true);
      
      const response = await vehicleAPI.types.getAll();
      console.log(response);

      if (response) {
        setVehicleTypes(response);
      }
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      toast.error("Failed to fetch vehicle types");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await vehicleAPI.types.update(selectedType._id, formData);
        toast.success("Vehicle type updated successfully");
      } else {
        await vehicleAPI.types.create(formData);
        toast.success("Vehicle type created successfully");
      }
      handleCloseDialog();
      fetchVehicleTypes();
    } catch (error) {
      console.error("Error submitting vehicle type:", error);
      toast.error("Failed to submit vehicle type");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle type?")) {
      try {
        await vehicleAPI.types.remove(id);
        toast.success("Vehicle type deleted successfully");
        fetchVehicleTypes();
      } catch (error) {
        console.error("Error deleting vehicle type:", error);
        toast.error("Failed to delete vehicle type");
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedType(null);
    setFormData({ name: "", description: "", active: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Types</h1>
          <p className="text-sm text-gray-600">Manage authorized vehicle categories</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
          >
            {viewMode === 'grid' ? <ViewList className="w-5 h-5" /> : <GridView className="w-5 h-5" />}
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setDialogOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Add className="w-5 h-5 mr-2" />
            Add Vehicle Type
          </button>
        </div>
      </div>

      {/* Vehicle Types View */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicleTypes.map((type) => (
            <div key={type._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <DirectionsCar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {type.name}
                      </h3>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    type.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {type.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {type.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      {type.description}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-2 border-t pt-4">
                  <button
                    onClick={() => {
                      setSelectedType(type);
                      setFormData({
                        name: type.name,
                        description: type.description || "",
                        active: type.active
                      });
                      setEditMode(true);
                      setDialogOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(type._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {vehicleTypes.map((type) => (
            <div 
              key={type._id} 
              className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-50 rounded-full">
                    <DirectionsCar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {type.name}
                    </h3>
                    {type.description && (
                      <p className="text-sm text-gray-600">
                        {type.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    type.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {type.active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedType(type);
                        setFormData({
                          name: type.name,
                          description: type.description || "",
                          active: type.active
                        });
                        setEditMode(true);
                        setDialogOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(type._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editMode ? "Edit Vehicle Type" : "Add New Vehicle Type"}
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700 mr-2">Active</label>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {editMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleTypeManagement;
