import { useState, useEffect } from "react";
import { TextField, Select, MenuItem, FormControlLabel, Switch } from "@mui/material";
import { Button } from "./ui";

function UserForm({ user, onSubmit, onCancel, currentUserRole }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "user",
    checkpost: "",
    active: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        password: "", // Don't populate password for edit
        fullName: user.fullName || "",
        role: user.role || "user",
        checkpost: user.checkpost?._id || "",
        active: user.active ?? true
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const roles = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    ...(currentUserRole === "super_admin" ? [{ value: "super_admin", label: "Super Admin" }] : [])
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <TextField
            fullWidth
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            disabled={!!user}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {user ? "New Password" : "Password *"}
          </label>
          <TextField
            fullWidth
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!user}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <TextField
            fullWidth
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <Select
            fullWidth
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            {roles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </div>

        <FormControlLabel
          control={
            <Switch
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            />
          }
          label="Active"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {user ? "Update" : "Create"} User
        </Button>
      </div>
    </form>
  );
}

export default UserForm; 