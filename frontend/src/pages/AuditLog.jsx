import { useState, useEffect } from "react";
import {
  History as HistoryIcon,
  Search,
  FilterList,
  FileDownload,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  Card,
  PageHeader,
  Button,
  DataTable,
  DateRangeFilter,
  Select,
  LoadingSpinner,
} from "../components/ui";
import { auditAPI } from "../services/api";
import toast from "react-hot-toast";

function AuditLog() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    action: "",
    user: "",
    module: "",
  });

  const columns = [
    {
      key: "timestamp",
      label: "Time",
      render: (row) => format(new Date(row.timestamp), "dd/MM/yyyy HH:mm:ss"),
    },
    {
      key: "user",
      label: "User",
      render: (row) => (
        <div className="space-y-1">
          <div className="font-medium">
            {row.user ? (
              <>
                {row.user.fullName}
                <span className="ml-1 text-xs text-gray-500">
                  ({row.user.username})
                </span>
              </>
            ) : (
              "System"
            )}
          </div>
          {row.user && (
            <>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                  {row.user.role}
                </span>
              </div>
              {row.user.checkpost && (
                <div className="text-xs text-gray-500">
                  {row.user.checkpost.name}
                  <span className="text-gray-400 ml-1">
                    ({row.user.checkpost.code})
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      key: "action",
      label: "Activity",
      render: (row) => (
        <div className="space-y-2">
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                row.action
              )}`}
            >
              {getActionLabel(row)}
            </span>
          </div>
          <div className="text-sm text-gray-600">{row.description}</div>
        </div>
      ),
    },
  ];

  const actionTypes = [
    { value: "VEHICLE_ENTRY", label: "Vehicle Entry" },
    { value: "VEHICLE_EXIT", label: "Vehicle Exit" },
    { value: "USER_CREATE", label: "User Created" },
    { value: "USER_UPDATE", label: "User Updated" },
    { value: "USER_DELETE", label: "User Deleted" },
    { value: "LOGIN", label: "User Login" },
    { value: "LOGOUT", label: "User Logout" },
    { value: "CHECKPOST_CREATE", label: "Checkpost Created" },
    { value: "CHECKPOST_UPDATE", label: "Checkpost Updated" },
    { value: "SETTINGS_UPDATE", label: "Settings Updated" },
  ];

  const modules = [
    { value: "VEHICLE", label: "Vehicle" },
    { value: "USER", label: "User" },
    { value: "CHECKPOST", label: "Checkpost" },
    { value: "VEHICLE_TYPE", label: "Vehicle Type" },
    { value: "AUTH", label: "Authentication" },
  ];

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await auditAPI.getLogs(filters);
      console.log(response.data);
      
      if (response) {
        setLogs(response.data);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (row) => {
    switch (row.action) {
      case "VEHICLE_ENTRY":
        return `Vehicle Entry`;
      case "VEHICLE_EXIT":
        return `Vehicle Exit`;
      case "USER_CREATE":
        return `User Created`;
      case "USER_UPDATE":
        return `User Updated`;
      case "USER_DELETE":
        return `User Deleted`;
      case "CHECKPOST_CREATE":
        return `Checkpost Created`;
      case "CHECKPOST_UPDATE":
        return `Checkpost Updated`;
      case "SETTINGS_UPDATE":
        return "Settings Updated";
      case "LOGIN":
        return "User Login";
      case "LOGOUT":
        return "User Logout";
      default:
        return row.action;
    }
  };

  const getActionColor = (action) => {
    if (action.includes("CREATE") || action.includes("ENTRY")) {
      return "bg-green-100 text-green-800";
    }
    if (action.includes("UPDATE")) {
      return "bg-blue-100 text-blue-800";
    }
    if (action.includes("DELETE") || action.includes("EXIT")) {
      return "bg-red-100 text-red-800";
    }
    if (action.includes("LOGIN")) {
      return "bg-purple-100 text-purple-800";
    }
    if (action.includes("LOGOUT")) {
      return "bg-orange-100 text-orange-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const handleExport = async () => {
    try {
      const response = await auditAPI.exportLogs(filters);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to export audit logs");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="Track system activities"
        icon={<HistoryIcon className="w-6 h-6" />}
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-green-50 text-green-600" : ""}
            >
              <FilterList className="w-5 h-5 mr-2" />
              Filters
            </Button>
            <Button variant="primary" onClick={handleExport}>
              <FileDownload className="w-5 h-5 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DateRangeFilter
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={(field, value) =>
                setFilters({ ...filters, [field]: value })
              }
            />

            <Select
              value={filters.action}
              onChange={(value) => setFilters({ ...filters, action: value })}
              options={actionTypes}
              placeholder="All Actions"
            />

            <Select
              value={filters.module}
              onChange={(value) => setFilters({ ...filters, module: value })}
              options={modules}
              placeholder="All Modules"
            />

            <div className="lg:col-span-4 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setFilters({
                    startDate: null,
                    endDate: null,
                    action: "",
                    user: "",
                    module: "",
                  });
                }}
              >
                Clear
              </Button>
              <Button variant="primary" onClick={handleSearch}>
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <DataTable columns={columns} data={logs} />
        )}
      </Card>
    </div>
  );
}

export default AuditLog;
