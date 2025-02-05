import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Search,
  ExitToApp,
  Visibility,
  GridView,
  ViewList,
  FilterList,
  DirectionsCar,
  Edit,
  Delete,
} from "@mui/icons-material";
import { vehicleAPI, checkpostAPI } from "../services/api";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import toast from "react-hot-toast";
import useStore from "../store/useStore";
import {
  DateRangeFilter,
  Select,
  StatusBadge,
  ViewToggle,
  PageHeader,
  Modal,
  LoadingSpinner,
  FilterBar,
  VehicleCard,
  EmptyState,
} from "../components/ui";
import { useTheme } from "../contexts/ThemeContext";
import { format } from "date-fns";

function VehicleList() {
  const { theme } = useTheme();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
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
      const response = await vehicleAPI.types.getAll();
      if (response) {
        const data = response.filter((item) => item.active === true);
        setVehicleTypes(data);
      }
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      toast.error("Failed to load vehicle types");
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleAPI.entries.getEntries(filters);
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };


  const handleDispatchChange = async (id, status)=>{
    try {
      const response = await vehicleAPI.entries.updateEntry(id, {
        status,
      });

      if (response) {
        toast.success("Dispatch changed successfully");
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle._id === id
              ? { ...vehicle, dispatch: status }
              : vehicle
          )
        );
      }
      
    } catch (error) {
      console.error("Error changing dispatch:", error);
    }
  }

  const handleSearch = () => {
    setPage(0);
    fetchVehicles();
  };

  const handleExit = async (id) => {
    try {
      const response = await vehicleAPI.entries.updateEntry(id, {
        status: "exited",
      });
      if (response.success) {
        toast.success("Vehicle exit recorded successfully");
        fetchVehicles();
      }
    } catch (error) {
      console.error("Error recording exit:", error);
      toast.error("Failed to record exit");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const response = await vehicleAPI.entries.deleteEntry(id);
        if (response.success) {
          toast.success("Entry deleted successfully");
          fetchVehicles();
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast.error("Failed to delete entry");
      }
    }
  };

  const handleViewDetails = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this entry?")) {
        const res = await vehicleAPI.entries.deleteEntry(id);
        fetchVehicles();
        if (res) {
          toast.success("Entry deleted successfully");
        }
      }
    } catch (error) {
      toast.error("Failed to delete vehicle entry");
    }
  };

  const getStatusColor = (status) => {
    return status === "entered"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Entries"
        subtitle="Track and manage vehicle movements"
        icon={<DirectionsCar className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-2">
            {/* <ViewToggle view={viewMode} onToggle={setViewMode} /> */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-green-50 text-green-600" : ""}
            >
              <FilterList className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        }
      />

      {/* Filters Section */}
      {showFilters && (
        <Card className="bg-white border border-gray-200 shadow-md p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <DateRangeFilter
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(field, value) =>
                setFilters({ ...filters, [field]: value })
              }
              className="w-full"
            />

            {/* Vehicle Type Filter */}
            <Select
              value={filters.vehicleType}
              onChange={(value) =>
                setFilters({ ...filters, vehicleType: value })
              }
              options={vehicleTypes.map((type) => ({
                value: type._id,
                label: type.name,
              }))}
              placeholder="All Vehicle Types"
              className="border-gray-300 rounded-lg w-full"
            />
          </div>

          {/* Button Section */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-300"
              onClick={() =>
                setFilters({
                  startDate: null,
                  endDate: null,
                  vehicleType: "",
                  status: "",
                })
              }
            >
              Clear
            </Button>
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={handleSearch}
            >
              Apply Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : !vehicles || vehicles.length === 0 ? (
        <EmptyState
          icon={DirectionsCar}
          title="No vehicles found"
          message="Try adjusting your filters or add a new vehicle entry"
          action={
            <Button
              variant="primary"
              onClick={() => navigate("/vehicle-entry")}
            >
              Add Vehicle Entry
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
          {Array.isArray(vehicles) &&
            vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onView={() => handleViewDetails(vehicle._id)}
                onDispatchChange={handleDispatchChange}
                onExit={
                  vehicle.status === "entered"
                    ? () => handleExit(vehicle._id)
                    : undefined
                }
              />
            ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Vehicle Entry - ${selectedVehicle?.vehicleNumber || ""}`}
      >
        {selectedVehicle && (
          <div className="space-y-6">
            {/* Vehicle Photo */}
            {selectedVehicle.photoUrl && (
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedVehicle.photoUrl}
                  alt={selectedVehicle.vehicleNumber}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Vehicle Information
                </h3>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Vehicle Number
                </label>
                <p className="mt-1 text-lg font-medium">
                  {selectedVehicle.vehicleNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Vehicle Type
                </label>
                <p className="mt-1 text-lg font-medium">
                  {selectedVehicle.vehicleType?.name}
                </p>
              </div>

              {/* Entry Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Entry Information
                </h3>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Checkpost
                </label>
                <p className="mt-1 text-lg font-medium">
                  {selectedVehicle.checkpost?.name} (
                  {selectedVehicle.checkpost?.code})
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Entry Time
                </label>
                <p className="mt-1 text-lg font-medium">
                  {format(
                    new Date(selectedVehicle.createdAt),
                    "dd/MM/yyyy HH:mm"
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Entered By
                </label>
                <p className="mt-1 text-lg font-medium">
                  {selectedVehicle.createdBy?.fullName ||
                    selectedVehicle.createdBy?.username}
                </p>
              </div>

              {/* Driver Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Driver Information
                </h3>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Driver Name
                </label>
                <p className="mt-1 text-lg font-medium">
                  {selectedVehicle.driverName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Driver Phone
                </label>
                <p className="mt-1 text-lg font-medium">
                  {selectedVehicle.driverPhone}
                </p>
              </div>

              {/* Purpose */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Additional Details
                </h3>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">
                Remarks
                </label>
                <p className="mt-1 text-lg font-medium">
                  {selectedVehicle.purpose}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default VehicleList;
