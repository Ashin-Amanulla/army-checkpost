import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { vehicleTypeAPI } from "../services/api";
import toast from "react-hot-toast";

function VehicleTypeManagement() {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = async () => {
    try {
      const { data } = await vehicleTypeAPI.getAll();
      setVehicleTypes(data);
    } catch (error) {
      toast.error("Failed to fetch vehicle types");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await vehicleTypeAPI.update(selectedType._id, formData);
        toast.success("Vehicle type updated successfully");
      } else {
        await vehicleTypeAPI.create(formData);
        toast.success("Vehicle type created successfully");
      }
      handleCloseDialog();
      fetchVehicleTypes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description || "",
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle type?")) {
      try {
        await vehicleTypeAPI.delete(id);
        toast.success("Vehicle type deleted successfully");
        fetchVehicleTypes();
      } catch (error) {
        toast.error("Failed to delete vehicle type");
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedType(null);
    setFormData({ name: "", description: "" });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" component="h1">
          Vehicle Type Management
        </Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Add New Vehicle Type
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicleTypes.map((type) => (
              <TableRow key={type._id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(type)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(type._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {editMode ? "Edit Vehicle Type" : "Add New Vehicle Type"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box className="space-y-4">
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default VehicleTypeManagement;
