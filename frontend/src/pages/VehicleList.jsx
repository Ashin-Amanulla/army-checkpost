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
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { vehicleAPI, checkpostAPI, settingsAPI } from "../services/api";
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
import EditVehicleModal from "../components/EditVehicleModal";

function VehicleList() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [masterSearch, setMasterSearch] = useState("");
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    vehicleType: "",
    checkpost: "",
    vehicleNumber: "",
    status: "",
    search: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { user } = useStore();
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [checkposts, setCheckposts] = useState([]);

  useEffect(() => {
    fetchCheckposts();
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
      const queryParams = {
        ...filters,
        page: page + 1, // API uses 1-indexed pages
        limit: rowsPerPage,
        startDate: filters.startDate
          ? format(filters.startDate, "yyyy-MM-dd")
          : undefined,
        endDate: filters.endDate
          ? format(filters.endDate, "yyyy-MM-dd")
          : undefined,
        search: masterSearch || filters.search,
      };

      const response = await vehicleAPI.entries.getEntries(queryParams);
      if (response.success) {
        setVehicles(response.data);
        setTotalEntries(response.pagination.total);
        setTotalPages(response.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckposts = async () => {
    try {
      const response = await checkpostAPI.getAll();
      if (response) {
        setCheckposts(response);
      }
    } catch (error) {
      console.error("Error fetching checkposts:", error);
      toast.error("Failed to load checkposts");
    }
  };

  const handleDispatchChange = async (id, status) => {
    try {
      const response = await vehicleAPI.entries.updateEntry(id, {
        status,
      });

      if (response) {
        toast.success("Dispatch changed successfully");
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle._id === id ? { ...vehicle, dispatch: status } : vehicle
          )
        );
      }
    } catch (error) {
      console.error("Error changing dispatch:", error);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchVehicles();
  };

  const handleMasterSearch = (e) => {
    if (e.key === "Enter") {
      setPage(0);
      fetchVehicles();
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleDeleteDetails = async (id) => {
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

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleSaveEdit = async (formData) => {
    try {
      await vehicleAPI.entries.updateVehicle(editingVehicle._id, formData);
      toast.success("Vehicle entry updated successfully");
      setEditingVehicle(null);
      fetchVehicles(); // Refresh the list
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error(error.response?.data?.message || "Error updating vehicle");
    }
  };

  const handleVerify = async (vehicleNumber) => {
    try {
      const response = await settingsAPI.verifyVehicle(vehicleNumber);
      if (response.success) {
        setSelectedVehicle(response.data);
        setDetailsOpen(true);
      }
    } catch (error) {
      console.error("Error verifying vehicle:", error);
      toast.error("Failed to verify vehicle");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Entries"
        subtitle="Track and manage vehicle movements"
        icon={<DirectionsCar className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-2">
            <ViewToggle view={viewMode} onToggle={setViewMode} />
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

      {/* Master Search */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={masterSearch}
            onChange={(e) => setMasterSearch(e.target.value)}
            onKeyDown={handleMasterSearch}
            placeholder="Search by vehicle number, driver name..."
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 flex items-center px-4 font-medium text-white bg-green-500 rounded-r-lg hover:bg-green-600"
          >
            Search
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Search across vehicle numbers, driver names and more
        </p>
      </div>

      {showFilters && (
        <Card className="bg-white border border-gray-200 shadow-md p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range Filter */}
            <DateRangeFilter
              startDate={filters.startDate}
              endDate={filters.endDate}
              onStartDateChange={(date) =>
                setFilters({ ...filters, startDate: date })
              }
              onEndDateChange={(date) =>
                setFilters({ ...filters, endDate: date })
              }
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

            {/* Checkpost Filter */}
            <Select
              value={filters.checkpost}
              onChange={(value) => setFilters({ ...filters, checkpost: value })}
              options={checkposts.map((cp) => ({
                value: cp._id,
                label: cp.name,
              }))}
              placeholder="All Checkposts"
              className="border-gray-300 rounded-lg w-full"
            />

            {/* Status Filter */}
            <Select
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { value: "", label: "All " },

                { value: "true", label: "yes" },
                { value: "false", label: "no" },
              ]}
              placeholder="Dispatch Status"
              className="border-gray-300 rounded-lg w-full"
            />
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setFilters({
                  startDate: null,
                  endDate: null,
                  vehicleType: "",
                  checkpost: "",
                  vehicleNumber: "",
                  status: "",
                  search: "",
                });
                setMasterSearch("");
                setPage(0);
                fetchVehicles();
              }}
            >
              Reset
            </Button>
            <Button onClick={handleSearch}>Apply Filters</Button>
          </div>
        </Card>
      )}

      {/* Results Summary and Count */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {vehicles.length > 0 ? page * rowsPerPage + 1 : 0} -{" "}
          {Math.min((page + 1) * rowsPerPage, totalEntries)} of {totalEntries}{" "}
          entries
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={rowsPerPage.toString()}
            onChange={(value) => {
              setRowsPerPage(parseInt(value, 10));
              setPage(0);
            }}
            options={[
              { value: "10", label: "10 per page" },
              { value: "15", label: "15 per page" },
              { value: "25", label: "25 per page" },
              { value: "50", label: "50 per page" },
            ]}
            className="border-gray-300 rounded-lg w-32"
          />
        </div>
      </div>

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
        <>
          {/* Grid View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(vehicles) &&
                vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="bg-white">
                    <VehicleCard
                      vehicle={vehicle}
                      onDelete={() => handleDeleteDetails(vehicle._id)}
                      onDispatchChange={handleDispatchChange}
                      onEdit={handleEdit}
                      onVerify={handleVerify}
                    />
                  </div>
                ))}
            </div>
          ) : (
            // Table View
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Checkpost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Remarks
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Entry Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Dispatched
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={vehicle.photoUrl || "/default-vehicle.jpg"}
                            alt={vehicle.vehicleNumber}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.vehicleNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.driverName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.checkpost?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.purpose}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(
                            new Date(vehicle.createdAt),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vehicle.dispatch
                            ? format(
                                new Date(vehicle?.dispatchDate),
                                "dd/MM/yyyy HH:mm"
                              )
                            : "No"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Dispatch Toggle */}
                          <div className=" flex justify-between items-center ">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Dispatch:</span>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="hidden"
                                  checked={vehicle.dispatch}
                                  onChange={() =>
                                    handleDispatchChange(
                                      vehicle._id,
                                      !vehicle.dispatch
                                    )
                                  }
                                />
                                <div
                                  className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition ${
                                    vehicle.dispatch
                                      ? "bg-green-500"
                                      : "bg-gray-400"
                                  }`}
                                >
                                  <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                                      vehicle.dispatch ? "translate-x-6" : ""
                                    }`}
                                  ></div>
                                </div>
                              </label>
                            </div>

                            {user?.role && (
                              <div className="flex space-x-2 ms-6">
                                <button
                                  onClick={() => handleEdit(vehicle)}
                                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                                  title="Edit Entry"
                                >
                                  <Edit className="w-5 h-5 text-blue-600" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteDetails(vehicle._id)
                                  }
                                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                                  title="Delete Entry"
                                >
                                  {user?.role !== "user" && (
                                    <Delete className="w-5 h-5 text-red-600" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">
              Page {page + 1} of {totalPages || 1}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className={`p-2 rounded-md ${
                  page === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-600 hover:bg-green-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                // Show pages around current page
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i;
                } else if (page < 3) {
                  pageToShow = i;
                } else if (page > totalPages - 3) {
                  pageToShow = totalPages - 5 + i;
                } else {
                  pageToShow = page - 2 + i;
                }

                return (
                  <button
                    key={pageToShow}
                    onClick={() => handleChangePage(pageToShow)}
                    className={`w-10 h-10 rounded-md ${
                      page === pageToShow
                        ? "bg-green-500 text-white"
                        : "text-gray-700 hover:bg-green-50"
                    }`}
                  >
                    {pageToShow + 1}
                  </button>
                );
              })}
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
                className={`p-2 rounded-md ${
                  page >= totalPages - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-600 hover:bg-green-50"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Details Modal */}
      <Modal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Vehicle Entry - ${selectedVehicle?.rc_regn_no || ""}`}
      >
        {selectedVehicle && (
          <div className="space-y-6">
            {/* Vehicle Photo */}
            {selectedVehicle.photoUrl && (
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedVehicle.photoUrl}
                  alt={selectedVehicle.rc_regn_no}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Vehicle Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Vehicle Information
                </h3>
              </div>

              <InfoRow
                label="Vehicle Number"
                value={selectedVehicle.rc_regn_no}
              />
              <InfoRow
                label="Registration Date"
                value={selectedVehicle.rc_regn_dt}
              />
              <InfoRow
                label="Registered At"
                value={selectedVehicle.rc_registered_at}
              />
              <InfoRow label="Fit Upto" value={selectedVehicle.rc_fit_upto} />
              <InfoRow label="Tax Upto" value={selectedVehicle.rc_tax_upto} />
              <InfoRow
                label="Vehicle Category"
                value={selectedVehicle.rc_vch_catg}
              />
              <InfoRow
                label="Vehicle Class"
                value={selectedVehicle.rc_vh_class_desc}
              />
              <InfoRow
                label="Manufacturer"
                value={selectedVehicle.rc_maker_desc}
              />
              <InfoRow label="Model" value={selectedVehicle.rc_maker_model} />
              <InfoRow label="Color" value={selectedVehicle.rc_color} />
              <InfoRow label="Fuel Type" value={selectedVehicle.rc_fuel_desc} />

              {/* Insurance Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Insurance Information
                </h3>
              </div>
              <InfoRow
                label="Insurance Company"
                value={selectedVehicle.rc_insurance_comp}
              />
              <InfoRow
                label="Policy Number"
                value={selectedVehicle.rc_insurance_policy_no}
              />
              <InfoRow
                label="Insurance Valid Upto"
                value={selectedVehicle.rc_insurance_upto}
              />

              {/* Owner Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Owner Information
                </h3>
              </div>
              <InfoRow
                label="Owner Name"
                value={selectedVehicle.rc_owner_name}
              />
              <InfoRow
                label="Father's Name"
                value={selectedVehicle.rc_f_name}
              />
              <InfoRow
                label="Permanent Address"
                value={selectedVehicle.rc_permanent_address}
              />

              {/* Additional Details */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Additional Details
                </h3>
              </div>
              <InfoRow label="Financer" value={selectedVehicle.rc_financer} />
              <InfoRow
                label="Chassis Number"
                value={selectedVehicle.rc_chasi_no}
              />
              <InfoRow
                label="Engine Number"
                value={selectedVehicle.rc_eng_no}
              />
              <InfoRow
                label="Manufacture Month/Year"
                value={selectedVehicle.rc_manu_month_yr}
              />
              <InfoRow label="PUCC Upto" value={selectedVehicle.rc_pucc_upto} />
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button variant="secondary" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <p className="mt-1 text-lg font-medium">{value || "--"}</p>
  </div>
);

export default VehicleList;
