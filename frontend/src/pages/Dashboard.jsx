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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, Button, StatsCard } from "../components/ui";
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
    hourlyDistribution: [],
    checkpostAnalytics: [],
    activeCheckposts: 0,
    checkpostDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("daily");
  const [timeRange, setTimeRange] = useState('daily'); // 'daily', 'weekly', 'monthly'

  const COLORS = ["#16a34a", "#2563eb", "#d97706", "#dc2626", "#7c3aed"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardAPI.getStats();
        console.log(data);
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Today's Entries"
          value={stats.todayEntries}
          icon={DirectionsCar}
        />
        <StatsCard
          title="Active Checkposts"
          value={stats.activeCheckposts}
          icon={LocationOn}
        />
        <StatsCard
          title="Total Entries"
          value={stats.totalEntries}
          subtitle="All time"
          icon={Assessment}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Summary Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Entry Summary</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [value, 'Entries']}
                  labelFormatter={(label) => format(new Date(label), 'dd MMM yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Checkpost Distribution Chart with Tabs */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Checkpost Entry Distribution</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('daily')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 'daily'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 'weekly'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === 'monthly'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats[`${timeRange}CheckpostDistribution`]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#16a34a"
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {stats[`${timeRange}CheckpostDistribution`]?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(142, ${30 + index * 20}%, ${40 + index * 10}%)`} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Entries Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Entries</h3>
          <button
            onClick={() => navigate("/vehicle-list")}
            className="text-sm text-green-600 hover:text-green-700"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checkpost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
      </Card>
    </div>
  );
}

export default Dashboard;
