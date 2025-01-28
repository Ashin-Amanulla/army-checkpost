import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download } from "@mui/icons-material";
import { vehicleAPI, checkpostAPI, vehicleTypeAPI } from "../services/api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function Reports() {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    checkpost: "",
    vehicleType: "",
  });
  const [loading, setLoading] = useState(true);
  const [checkposts, setCheckposts] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [reportData, setReportData] = useState({
    entries: [],
    checkpostStats: [],
    vehicleTypeStats: [],
    hourlyStats: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [checkpostsRes, typesRes] = await Promise.all([
        checkpostAPI.getAll(),
        vehicleTypeAPI.getAll(),
      ]);
      setCheckposts(checkpostsRes.data);
      setVehicleTypes(typesRes.data);
      await generateReport();
    } catch (error) {
      toast.error("Failed to fetch initial data");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data } = await vehicleAPI.getEntries(filters);

      // Process data for different charts
      const checkpostStats = processCheckpostStats(data);
      const vehicleTypeStats = processVehicleTypeStats(data);
      const hourlyStats = processHourlyStats(data);

      setReportData({
        entries: data,
        checkpostStats,
        vehicleTypeStats,
        hourlyStats,
      });
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const processCheckpostStats = (data) => {
    const stats = {};
    data.forEach((entry) => {
      const checkpostName = entry.checkpost.name;
      stats[checkpostName] = (stats[checkpostName] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  };

  const processVehicleTypeStats = (data) => {
    const stats = {};
    data.forEach((entry) => {
      const typeName = entry.vehicleType.name;
      stats[typeName] = (stats[typeName] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  };

  const processHourlyStats = (data) => {
    const stats = new Array(24).fill(0);
    data.forEach((entry) => {
      const hour = new Date(entry.entryTime).getHours();
      stats[hour]++;
    });
    return stats.map((value, hour) => ({
      hour: `${hour}:00`,
      entries: value,
    }));
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reportData.entries.map((entry) => ({
        "Vehicle Number": entry.vehicleNumber,
        "Driver Name": entry.driverName,
        "Driver Phone": entry.driverPhone,
        "Vehicle Type": entry.vehicleType.name,
        Checkpost: entry.checkpost.name,
        "Entry Time": new Date(entry.entryTime).toLocaleString(),
        "Exit Time": entry.exitTime
          ? new Date(entry.exitTime).toLocaleString()
          : "N/A",
        Status: entry.status,
        Purpose: entry.purpose,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicle Entries");
    XLSX.writeFile(workbook, "vehicle-entries-report.xlsx");
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" component="h1" className="mb-6">
        Reports & Analytics
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
                label="Checkpost"
                value={filters.checkpost}
                onChange={(e) =>
                  setFilters({ ...filters, checkpost: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                {checkposts.map((cp) => (
                  <MenuItem key={cp._id} value={cp._id}>
                    {cp.name}
                  </MenuItem>
                ))}
              </TextField>
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
              <Box className="space-x-2">
                <Button variant="contained" onClick={generateReport}>
                  Generate
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={exportToExcel}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Entries by Checkpost
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={reportData.checkpostStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {reportData.checkpostStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vehicle Type Distribution
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={reportData.vehicleTypeStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {reportData.vehicleTypeStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hourly Entry Distribution
              </Typography>
              <BarChart
                width={800}
                height={300}
                data={reportData.hourlyStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entries" fill="#8884d8" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;
