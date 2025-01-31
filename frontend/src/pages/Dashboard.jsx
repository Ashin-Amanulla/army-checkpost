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
import { Card } from "../components/ui";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEntries: 0,
    activeVehicles: 0,
    todayEntries: 0,
    recentEntries: [],
    weeklyTotal: 0,
    monthlyTotal: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Operational Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Entries */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Entries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.todayEntries}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Today className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Active Vehicles */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.activeVehicles}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <DirectionsCar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Entries */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalEntries}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <ExitToApp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/vehicle-entry')}
            className="p-4 text-center rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
          >
            <DirectionsCar className="w-6 h-6 text-green-600 mx-auto" />
            <span className="block mt-2 text-sm text-gray-600">New Entry</span>
          </button>
          <button
            onClick={() => navigate('/vehicle-list')}
            className="p-4 text-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <ListAlt className="w-6 h-6 text-blue-600 mx-auto" />
            <span className="block mt-2 text-sm text-gray-600">View Entries</span>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="p-4 text-center rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
          >
            <Assessment className="w-6 h-6 text-amber-600 mx-auto" />
            <span className="block mt-2 text-sm text-gray-600">Reports</span>
          </button>
          <button
            onClick={() => navigate('/audit-logs')}
            className="p-4 text-center rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <History className="w-6 h-6 text-purple-600 mx-auto" />
            <span className="block mt-2 text-sm text-gray-600">Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Weekly/Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Overview</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Entries</span>
              <span className="text-lg font-medium">{stats.weeklyTotal}</span>
            </div>
            {/* Add more weekly stats */}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Overview</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Entries</span>
              <span className="text-lg font-medium">{stats.monthlyTotal}</span>
            </div>
            {/* Add more monthly stats */}
          </div>
        </Card>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Entries</h2>
          <button
            onClick={() => navigate('/vehicle-list')}
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
      </div>
    </div>
  );
}

export default Dashboard;
