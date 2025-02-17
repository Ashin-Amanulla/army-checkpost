import { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import {
  DirectionsCar,
  ExitToApp,
  Today,
  Assessment,
  ListAlt,
  History,
  TrendingUp,
  LocationOn,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, Button, StatsCard, Tabs } from "../components/ui";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useStore from "../store/useStore";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEntries: 0,
    activeVehicles: 0,
    todayEntries: 0,
    recentEntries: [],
    weeklyTotal: 0,
    monthlyTotal: 0,
    vehicleTypeData: [],
    weeklyTrends: [],
    checkpostDistribution: [],
    lastLogins: [],
    siteVisits: { total: 0, admin: 0, user: 0 },
    adminLastLogins: [],
  });
  const [timeRange, setTimeRange] = useState("alltime");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useStore();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    fetchDashboardData();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats(timeRange);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const timeTabs = [
    { label: "All Time", value: "alltime" },
    { label: "Monthly", value: "monthly" },
    { label: "Weekly", value: "weekly" },
  ];

  const getActivityDescription = (action) => {
    switch (action) {
      case "USER_LOGIN":
        return "Logged in";
      case "VEHICLE_ENTRY":
        return "Created vehicle entry";
      case "VEHICLE_EXIT":
        return "Marked vehicle exit";
      case "USER_UPDATE":
        return "Updated user information";
      default:
        return action.replace(/_/g, " ").toLowerCase();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Entries"
          value={stats.totalEntries}
          icon={DirectionsCar}
        />
        <StatsCard
          title="Active Vehicles"
          value={stats.activeVehicles}
          icon={ExitToApp}
        />
        <StatsCard
          title="Today's Entries"
          value={stats.todayEntries}
          icon={Today}
        />
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Site Visits</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Visits</span>
              <span className="text-xl font-semibold">
                {stats.siteVisits.total}
              </span>
            </div>
            {/* <div className="flex justify-between items-center">
              <span className="text-gray-600">Admin Visits</span>
              <span className="text-green-600 font-medium">
                {stats.siteVisits.admin}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User Visits</span>
              <span className="text-blue-600 font-medium">
                {stats.siteVisits.user}
              </span>
            </div> */}
          </div>
        </Card>
        {/* <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Admin Last Logins</h3>
          <div className="space-y-3">
            {Array.isArray(stats.adminLastLogins) &&
              stats.adminLastLogins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                >
                  <div className="p-2 bg-green-50 rounded-full">
                    <Person className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{admin.username}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(admin.lastLogin), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            {Array.isArray(stats.adminLastLogins) &&
              stats.adminLastLogins.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  No admin login history
                </p>
              )}
          </div>
        </Card> */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkpost Distribution */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">
              Checkpost Entry Distribution
            </h3>
            <Tabs
              tabs={timeTabs}
              activeTab={timeRange}
              onChange={setTimeRange}
              className="mb-4"
            />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.checkpostDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#16a34a"
                    stroke="#047857"
                    radius={[4, 4, 0, 0]}
                  >
                    {stats.checkpostDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.active ? "#16a34a" : "#9ca3af"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {stats.checkpostDistribution.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Vehicle Type Distribution */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">
              Vehicle Type Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.vehicleTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.vehicleTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {stats.vehicleTypeData.length === 0 && (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity and Last Logins */}
      {user.role   !== "user" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Entries */}
          <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Recent Entries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Vehicle Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Checkpost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentEntries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.vehicleNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.vehicleType?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.checkpost?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(entry.createdAt), "dd/MM/yyyy HH:mm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {stats.recentEntries.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent entries</p>
              </div>
            )}
          </div>
        </Card>

        {/* Last Logins */}
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Recent User Activity</h3>
            <div className="space-y-4">
              {stats.lastLogins.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-green-50 rounded-full">
                    <Person className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getActivityDescription(activity.action)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(activity.timestamp), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
              {(!Array.isArray(stats.lastLogins) ||
                stats.lastLogins.length === 0) && (
                <p className="text-sm text-gray-500 text-center">
                  No recent activity
                </p>
              )}
            </div>
          </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
