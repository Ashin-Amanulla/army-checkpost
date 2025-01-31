import { LocationOn } from "@mui/icons-material";

const CheckpostBadge = ({ name, code, className = "" }) => {
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full ${className}`}>
      <LocationOn className="w-4 h-4 text-green-600" />
      <span className="text-sm font-medium text-gray-700">
        {name} {code && <span className="text-gray-500">({code})</span>}
      </span>
    </div>
  );
};

export default CheckpostBadge; 