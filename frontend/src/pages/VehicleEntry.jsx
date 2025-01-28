import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { vehicleAPI, vehicleTypeAPI } from "../services/api";
import toast from "react-hot-toast";

function VehicleEntry() {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "",
    driverName: "",
    driverPhone: "",
    purpose: "",
    photo: null,
  });
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = async () => {
    try {
      const { data } = await vehicleTypeAPI.getAll();
      setVehicleTypes(data);
    } catch (error) {
      toast.error("Failed to fetch vehicle types");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      await vehicleAPI.createEntry(formDataToSend);
      toast.success("Vehicle entry created successfully");

      // Reset form
      setFormData({
        vehicleNumber: "",
        vehicleType: "",
        driverName: "",
        driverPhone: "",
        purpose: "",
        photo: null,
      });
      setPhotoPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-2xl mx-auto">
      <Typography variant="h5" component="h1" className="mb-6">
        New Vehicle Entry
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  value={formData.vehicleNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleNumber: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Vehicle Type"
                  value={formData.vehicleType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleType: e.target.value,
                    })
                  }
                  required
                >
                  {vehicleTypes.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Driver Name"
                  value={formData.driverName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      driverName: e.target.value,
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Driver Phone"
                  value={formData.driverPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      driverPhone: e.target.value,
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose"
                  multiline
                  rows={2}
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purpose: e.target.value,
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Box className="space-y-2">
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                  >
                    Upload Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoChange}
                      required
                    />
                  </Button>
                  {photoPreview && (
                    <Box className="mt-2">
                      <img
                        src={photoPreview}
                        alt="Vehicle preview"
                        className="max-w-xs rounded-lg shadow-md"
                      />
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  size="large"
                >
                  {loading ? <CircularProgress size={24} /> : "Create Entry"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default VehicleEntry;
