import { useState, useEffect } from "react";
import { Assessment, FileDownload } from "@mui/icons-material";
import { format } from "date-fns";
import { PageHeader, Card, DateRangeFilter } from "../components/ui";
import useStore from "../store/useStore";
import { reportsAPI } from "../services/api";
import toast from "react-hot-toast";

function Reports() {
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState();
  console.log("🚀 ~ Reports ~ stats:", stats)
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    reportType: "",
    format: "excel"
  });

  const reportTypes = [
    { value: "checkpost_entries", label: "Checkpost-wise Entries" },
    { value: "daily_summary", label: "Daily Entry Summary" },
    { value: "vehicle_type_analysis", label: "Vehicle Type Analysis" },
   
  ];

  const exportFormats = [
    { value: "excel", label: "Excel (.xlsx)" },
    { value: "csv", label: "CSV" },
    { value: "pdf", label: "PDF" }
  ];

  const getTodays = async () => {
    const res = await reportsAPI.getTodayStats()
    if(res.success){
      setStats(res.data)
    }
  }

  useEffect(() => {
    getTodays()
  }, [])

  const getDateRange = (range) => {
    const now = new Date();
    switch (range) {
      case 'today':
        return { start: now, end: now };
      case 'yesterday': {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: yesterday };
      }
      case 'week': {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        return { start: weekStart, end: now };
      }
      case 'month': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart, end: now };
      }
      case 'quarter': {
        const quarterStart = new Date(now);
        quarterStart.setMonth(quarterStart.getMonth() - 3);
        return { start: quarterStart, end: now };
      }
      default:
        return { start: now, end: now };
    }
  };

  const handleExport = async () => {
    try {
        setLoading(true);
        const response = await reportsAPI.generateReport({
            ...filters,
            checkpost: user.role === "user" ? user.checkpost : filters.checkpost
        });

        // Create a Blob URL from the response
        const blob = new Blob([response], { type: response.type });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary <a> element to trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = `report-${filters.reportType}-${format(new Date(), "yyyy-MM-dd")}.${getFileExtension(filters.format)}`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success("Report exported successfully");
    } catch (error) {
        console.error("Export error:", error);
        toast.error("Failed to export report");
    } finally {
        setLoading(false);
    }
};

  const getFileExtension = (format) => {
    switch (format) {
      case "excel": return "xlsx";
      case "csv": return "csv";
      case "pdf": return "pdf";
      default: return "xlsx";
    }
  };

  const quickReports = [
    {
      label: "Today's Entries",
      action: () => {
        const { start, end } = getDateRange('today');
        setFilters({ 
          ...filters, 
          startDate: start, 
          endDate: end, 
          reportType: "checkpost_entries" 
        });
      }
    },
    {
      label: "This Week's Summary",
      action: () => {
        const { start, end } = getDateRange('week');
        setFilters({ 
          ...filters, 
          startDate: start, 
          endDate: end, 
          reportType: "daily_summary" 
        });
      }
    },
    {
      label: "Monthly Vehicle Types",
      action: () => {
        const { start, end } = getDateRange('month');
        setFilters({ 
          ...filters, 
          startDate: start, 
          endDate: end, 
          reportType: "vehicle_type_analysis" 
        });
      }
    }
  ];

  const handleGenerateReport = async () => {
    try {
      const response = await reportsAPI.generateReport(filters);
      // ... handle response
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const blob = await reportsAPI.downloadReport(reportId);
      // ... handle download
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Export and analyze data"
        icon={<Assessment className="w-6 h-6" />}
      />

      <Card>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <DateRangeFilter
                startDate={filters.startDate}
                endDate={filters.endDate}
                onChange={(field, value) =>
                  setFilters({ ...filters, [field]: value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={filters.reportType}
                onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select Report Type</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Export Format
              </label>
              <select
                value={filters.format}
                onChange={(e) => setFilters({ ...filters, format: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                {exportFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExport}
              disabled={!filters.reportType || loading}
              className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
                !filters.reportType || loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FileDownload className="w-5 h-5 mr-2" />
              )}
              Export Report
            </button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Today's Summary</h3>
            <dl className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Today's Entries</dt>
                <dd className="text-sm font-medium text-gray-900">{stats?.totalEntries}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Today's Dispatch</dt>
                <dd className="text-sm font-medium text-gray-900">{stats?.dispatchedEntries}</dd>
              </div>
            </dl>
          </div>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Quick Reports</h3>
            <div className="mt-5 space-y-3">
              {quickReports.map((report) => (
                <button
                  key={report.label}
                  onClick={report.action}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {report.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Reports;
