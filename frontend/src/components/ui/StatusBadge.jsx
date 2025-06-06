const StatusBadge = ({ status, className = "" }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "entered":
        return "bg-green-100 text-green-800 border-green-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge; 