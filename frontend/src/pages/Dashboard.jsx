import { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import { 
  DirectionsCar, 
  ExitToApp, 
  Today, 
  Assessment,
  ListAlt,
  History,
  TrendingUp
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, Button } from "../components/ui";
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
  Cell
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
    checkpostAnalytics: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('daily');

  const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed'];

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Entries</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.todayEntries}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Today className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.activeVehicles}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <DirectionsCar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Total</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.weeklyTotal}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Assessment className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Total</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {stats.monthlyTotal}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="entries" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vehicle Type Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Type Distribution</h3>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hourly Distribution Chart */}
        {/* <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hourly Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="entries" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card> */}

        {/* Checkpost Analytics */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Checkpost Analytics</h3>
            <div className="flex gap-2">
              <Button
                variant={timeframe === 'daily' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTimeframe('daily')}
              >
                Daily
              </Button>
              <Button
                variant={timeframe === 'weekly' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTimeframe('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={timeframe === 'monthly' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTimeframe('monthly')}
              >
                Monthly
              </Button>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.checkpostAnalytics}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    timeframe === 'daily' ? value.toFixed(1) : Math.round(value),
                    'Entries'
                  ]}
                />
                <Legend />
                <Bar
                  dataKey={
                    timeframe === 'daily'
                      ? 'avgDailyEntries'
                      : timeframe === 'weekly'
                      ? 'weeklyTotal'
                      : 'totalEntries'
                  }
                  fill="#16a34a"
                  name={`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Entries`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.checkpostAnalytics?.map((checkpost) => (
              <div
                key={checkpost._id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="text-sm font-medium text-gray-600">{checkpost.name}</h4>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {timeframe === 'daily'
                    ? checkpost.avgDailyEntries
                    : timeframe === 'weekly'
                    ? Math.round(checkpost.avgDailyEntries * 7)
                    : checkpost.totalEntries}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {timeframe === 'daily'
                    ? 'Avg. Daily Entries'
                    : timeframe === 'weekly'
                    ? 'Weekly Entries'
                    : 'Monthly Entries'}
                </p>
              </div>
            ))}
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
                    {format(new Date(entry.createdAt), 'dd/MM/yyyy HH:mm')}
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
