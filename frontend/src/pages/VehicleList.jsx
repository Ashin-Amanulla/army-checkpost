import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { Search, ExitToApp, Visibility } from "@mui/icons-material";
import { vehicleAPI, vehicleTypeAPI } from "../services/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import toast from "react-hot-toast";
import useStore from "../store/useStore";

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    vehicleType: "",
    status: "",
    search: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { user } = useStore();

  useEffect(() => {
    fetchVehicleTypes();
    fetchVehicles();
  }, [page, rowsPerPage]);

  const fetchVehicleTypes = async () => {
    try {
      const { data } = await vehicleTypeAPI.getAll();
      setVehicleTypes(data);
    } catch (error) {
      toast.error("Failed to fetch vehicle types");
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: page + 1,
        limit: rowsPerPage,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      };
      const { data } = await vehicleAPI.getEntries(params);
      setVehicles(data);
    } catch (error) {
      toast.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchVehicles();
  };

  const handleExitVehicle = async (id) => {
    try {
      await vehicleAPI.updateExit(id);
      toast.success("Vehicle exit recorded");
      fetchVehicles();
    } catch (error) {
      toast.error("Failed to record vehicle exit");
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const { data } = await vehicleAPI.getEntry(id);
      setSelectedVehicle(data);
      console.log(data);
      setDetailsOpen(true);
    } catch (error) {
      toast.error("Failed to fetch vehicle details");
    }
  };

  const getStatusColor = (status) => {
    return status === "entered" ? "success" : "default";
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" className="mb-6">
        Vehicle List
      </Typography>

      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) =>
                    setFilters({ ...filters, startDate: date })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => setFilters({ ...filters, endDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                select
                label="Vehicle Type"
                value={filters.vehicleType}
                onChange={(e) =>
                  setFilters({ ...filters, vehicleType: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                {vehicleTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                select
                label="Status"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="entered">Entered</MenuItem>
                <MenuItem value="exited">Exited</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Entry Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle._id}>
                  <TableCell>{vehicle.vehicleNumber}</TableCell>
                  <TableCell>{vehicle.driverName}</TableCell>
                  <TableCell>{vehicle.vehicleType.name}</TableCell>
                  <TableCell>
                    {new Date(vehicle.entryTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vehicle.status}
                      color={getStatusColor(vehicle.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleViewDetails(vehicle._id)}
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                    {vehicle.status === "entered" && (
                      <IconButton
                        onClick={() => handleExitVehicle(vehicle._id)}
                        size="small"
                        color="primary"
                      >
                        <ExitToApp />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Vehicle Details</DialogTitle>
        <DialogContent>
          {selectedVehicle && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Vehicle Number</Typography>
                <Typography>{selectedVehicle.vehicleNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Driver Name</Typography>
                <Typography>{selectedVehicle.driverName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Driver Phone</Typography>
                <Typography>{selectedVehicle.driverPhone}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Purpose</Typography>
                <Typography>{selectedVehicle.purpose}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Vehicle Photo</Typography>
                <img
                  src={selectedVehicle.photoUrl}
                  alt="Vehicle"
                  className="max-w-full h-auto rounded-lg mt-2"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VehicleList;
