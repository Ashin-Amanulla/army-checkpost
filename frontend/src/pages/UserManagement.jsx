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
  MenuItem,
  CircularProgress,
  Switch,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { authAPI, checkpostAPI } from "../services/api";
import toast from "react-hot-toast";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [checkposts, setCheckposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "user",
    checkpost: "",
    active: true,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [usersRes, checkpostsRes] = await Promise.all([
        authAPI.getAllUsers(),
        checkpostAPI.getAll(),
      ]);
      setUsers(usersRes.data);
      setCheckposts(checkpostsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await authAPI.updateUser(selectedUser._id, formData);
        toast.success("User updated successfully");
      } else {
        console.log(formData);
        await authAPI.register(formData);
        toast.success("User created successfully");
      }
      handleCloseDialog();
      fetchInitialData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: "",
      email: user.email,
      role: user.role,
      checkpost: user.checkpost?._id || "",
      active: user.active,
    });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await authAPI.deleteUser(id);
        toast.success("User deleted successfully");
        fetchInitialData();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setSelectedUser(null);
    setFormData({
      username: "",
      password: "",
      email: "",
      role: "user",
      checkpost: "",
      active: true,
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" component="h1">
          User Management
        </Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Add New User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Checkpost</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.checkpost?.name || "N/A"}</TableCell>
                <TableCell>{user.active ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(user._id)}
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
        <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box className="space-y-4">
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                disabled={editMode}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editMode}
                helperText={
                  editMode ? "Leave blank to keep current password" : ""
                }
              />
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                select
                label="Role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                required
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="super_admin">Super Admin</MenuItem>
              </TextField>
              {formData.role === "user" && (
                <TextField
                  fullWidth
                  select
                  label="Checkpost"
                  value={formData.checkpost}
                  onChange={(e) =>
                    setFormData({ ...formData, checkpost: e.target.value })
                  }
                  required
                >
                  {checkposts.map((cp) => (
                    <MenuItem key={cp._id} value={cp._id}>
                      {cp.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <Box className="flex items-center">
                <Typography>Active</Typography>
                <Switch
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
              </Box>
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

export default UserManagement;
