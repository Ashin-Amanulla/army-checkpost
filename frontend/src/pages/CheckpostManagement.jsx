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
import { checkpostAPI } from "../services/api";
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
      const { data } = await checkpostAPI.getAll();
      setCheckposts(data);
    } catch (error) {
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

  const handleEdit = (checkpost) => {
    setSelectedCheckpost(checkpost);
    setFormData({
      name: checkpost.name,
      location: checkpost.location,
      code: checkpost.code,
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this checkpost?")) {
      try {
        await checkpostAPI.delete(id);
        toast.success("Checkpost deleted successfully");
        fetchCheckposts();
      } catch (error) {
        toast.error("Failed to delete checkpost");
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedCheckpost(null);
    setFormData({ name: "", location: "", code: "" });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" component="h1">
          Checkpost Management
        </Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Add New Checkpost
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkposts.map((checkpost) => (
              <TableRow key={checkpost._id}>
                <TableCell>{checkpost.name}</TableCell>
                <TableCell>{checkpost.code}</TableCell>
                <TableCell>{checkpost.location}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(checkpost)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(checkpost._id)}
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
          {editMode ? "Edit Checkpost" : "Add New Checkpost"}
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
                label="Code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
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

export default CheckpostManagement;
