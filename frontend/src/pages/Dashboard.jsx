import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { vehicleAPI } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEntries: 0,
    activeVehicles: 0,
    todayEntries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await vehicleAPI.getEntries({
          startDate: new Date().toISOString().split("T")[0],
        });

        setStats({
          totalEntries: data.length,
          activeVehicles: data.filter((entry) => entry.status === "entered")
            .length,
          todayEntries: data.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="space-y-6">
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Entries Today
              </Typography>
              <Typography variant="h3">{stats.todayEntries}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Vehicles
              </Typography>
              <Typography variant="h3">{stats.activeVehicles}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Entries
              </Typography>
              <Typography variant="h3">{stats.totalEntries}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
