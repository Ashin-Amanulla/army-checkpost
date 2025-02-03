import { useState, useEffect } from "react";
import { Edit,Delete,Business } from "@mui/icons-material";
import { checkpostAPI } from "../services/api";
import {
  PageHeader,
  Card,
  Button,
  DataTable,
  Modal,
  LoadingSpinner,
} from "../components/ui";
import toast from "react-hot-toast";

function CheckpostManagement() {
  const [checkposts, setCheckposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCheckpost, setSelectedCheckpost] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    code: "",
  });

  useEffect(() => {
    fetchCheckposts();
  }, []);

  const fetchCheckposts = async () => {
    try {
      setLoading(true);
      const response = await checkpostAPI.getAll();
      if (response) {
       
        setCheckposts(response);
      }
    } catch (error) {
      console.error("Error fetching checkposts:", error);
      toast.error("Failed to fetch checkposts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await checkpostAPI.update(selectedCheckpost._id, formData);
        toast.success("Checkpost updated successfully");
      } else {
        await checkpostAPI.create(formData);
        toast.success("Checkpost created successfully");
      }
      handleCloseDialog();
      fetchCheckposts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedCheckpost(null);
    setFormData({ name: "", location: "", code: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this checkpost?")) {
      try {
        await checkpostAPI.remove(id);
        toast.success("Checkpost deleted successfully");
        fetchCheckposts();
      } catch (error) {
        toast.error("Failed to delete checkpost");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checkpost Management</h1>
          <p className="text-sm text-gray-600">Manage military checkposts</p>
        </div>
        <button
          onClick={() => {
            setEditMode(false);
            setDialogOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Business className="w-5 h-5 mr-2" />
          Add Checkpost
        </button>
      </div>

      {/* Checkpost Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checkposts.map((checkpost) => (
            <div key={checkpost._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <Business className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {checkpost.name}
                      </h3>
                      <p className="text-sm text-gray-500">Code: {checkpost.code}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    checkpost.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {checkpost.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {checkpost.location}
                  </p>
                </div>

                <div className="mt-4 flex justify-end space-x-2 border-t pt-4">
                  <button
                    onClick={() => {
                      setSelectedCheckpost(checkpost);
                      setFormData({
                        name: checkpost.name,
                        location: checkpost.location,
                        code: checkpost.code,
                      });
                      setEditMode(true);
                      setDialogOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(checkpost._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkpost Form Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editMode ? "Edit Checkpost" : "Add New Checkpost"}
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
                  <label className="block text-sm font-medium text-gray-700">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <textarea
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
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

export default CheckpostManagement;
