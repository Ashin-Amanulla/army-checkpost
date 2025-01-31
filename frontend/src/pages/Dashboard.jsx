import { useEffect, useState } from "react";
import { vehicleAPI } from "../services/api";
import { DirectionsCar, ExitToApp, Today } from "@mui/icons-material";

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
          {/* Add more quick actions as needed */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
