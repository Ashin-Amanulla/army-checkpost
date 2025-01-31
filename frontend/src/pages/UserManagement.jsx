import { useState, useEffect, useMemo } from "react";
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
import {
  Edit,
  Delete,
  Add,
  Badge,
  Search,
  People,
  PersonAddAlt1 as UserPlus,
} from "@mui/icons-material";
import { authAPI, checkpostAPI } from "../services/api";
import toast from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";
import {
  PageHeader,
  Modal,
  LoadingSpinner,
  ViewToggle,
  FilterBar,
  Select,
  SearchInput,
  EmptyState,
} from "../components/ui";
import useStore from "../store/useStore";
import UserForm from "../components/UserForm";

function UserManagement() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [checkposts, setCheckposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    checkpost: "",
    role: "",
    status: "",
  });
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
  const { user: currentUser } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [usersRes, checkpostsRes] = await Promise.all([
        authAPI.getAllUsers(),
        checkpostAPI.getAll(),
      ]);
      console.log(usersRes);
      if (usersRes && usersRes.data.success && Array.isArray(usersRes.data.data)) {
        setUsers(usersRes.data.data);
      } else {
        console.error("Unexpected data format:", usersRes);
        setUsers([]);
      }
      if (checkpostsRes && checkpostsRes.success) {
        setCheckposts(checkpostsRes.data);
      } else {
        setCheckposts([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch data");
      setUsers([]);
      setCheckposts([]);
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
        await authAPI.register({
          ...formData,
          checkpost: formData.checkpost || currentUser.checkpost,
        });
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

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const handleSearch = () => {
    fetchInitialData();
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users
      .filter((u) => u._id !== currentUser._id)
      .sort((a, b) => {
        const roleOrder = { super_admin: 1, admin: 2, user: 3 };
        return roleOrder[a.role] - roleOrder[b.role];
      });
  }, [users, currentUser._id]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage system users and permissions"
        icon={<People className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-2">
            <ViewToggle view={viewMode} onToggle={setViewMode} />
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-green-50 text-green-600" : ""}
            >
              <Search className="w-5 h-5 mr-2" />
              Search & Filters
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedUser(null);
                setModalOpen(true);
              }}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add User
            </Button>
          </div>
        }
      />

      {/* Search & Filters */}
      {showFilters && (
        <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Input */}
              <div className="col-span-full lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Users
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    placeholder="Search by username or email..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Checkpost Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Checkpost
                </label>
                <select
                  value={filters.checkpost}
                  onChange={(e) =>
                    setFilters({ ...filters, checkpost: e.target.value })
                  }
                  className="block w-full py-2.5 pl-3 pr-10 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Checkposts</option>
                  {checkposts.map((cp) => (
                    <option key={cp._id} value={cp._id}>
                      {cp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                  className="block w-full py-2.5 pl-3 pr-10 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="block w-full py-2.5 pl-3 pr-10 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700"
                  >
                    {key}: {value}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, [key]: "" }))
                      }
                      className="ml-2 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Filter Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-sm text-gray-600">
                {filteredUsers.length} users found
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setFilters({
                      search: "",
                      checkpost: "",
                      role: "",
                      status: "",
                    })
                  }
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Clear All
                </button>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* User List/Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={People}
          title="No users found"
          message="Try adjusting your search or filters"
          action={
            <Button
              variant="primary"
              onClick={() => {
                setSelectedUser(null);
                setModalOpen(true);
              }}
            >
              Add User
            </Button>
          }
        />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredUsers.map((user) => (
            <Card key={user._id}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Badge className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Checkpost</span>
                    <span className="font-medium">
                      {user.checkpost?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-medium ${
                        user.active ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2 border-t pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    <Delete className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* User Form Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedUser ? "Edit User" : "Add New User"}
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          currentUserRole={currentUser.role}
        />
      </Modal>
    </div>
  );
}

export default UserManagement;
