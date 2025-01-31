import { format } from "date-fns";
import { DirectionsCar, ExitToApp, Visibility } from "@mui/icons-material";
import { StatusBadge } from "./";

const VehicleCard = ({ 
  vehicle, 
  onView, 
  onExit,
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${className}`}>
      {/* Vehicle Photo */}
      {vehicle.photoUrl && (
        <div className="relative h-48 bg-gray-100">
          <img
            src={vehicle.photoUrl}
            alt={vehicle.vehicleNumber}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-full">
              <DirectionsCar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {vehicle.vehicleNumber}
              </h3>
              <p className="text-sm text-gray-500">
                {vehicle.vehicleType?.name || "Unknown Type"}
              </p>
            </div>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Driver</p>
              <p className="font-medium">{vehicle.driverName}</p>
              <p className="text-xs text-gray-500">{vehicle.driverPhone}</p>
            </div>
            <div>
              <p className="text-gray-500">Entry Time</p>
              <p className="font-medium">
                {format(new Date(vehicle.createdAt), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Entered By</p>
              <p className="font-medium">{vehicle.createdBy?.username || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Purpose</p>
              <p className="text-sm line-clamp-2">{vehicle.purpose}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Checkpost</p>
              <p className="text-sm font-medium">
                {vehicle.checkpost?.name} ({vehicle.checkpost?.code})
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2 border-t pt-4">
          <button
            onClick={onView}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            title="View Details"
          >
            <Visibility className="w-5 h-5" />
          </button>
          {vehicle.status === "entered" && onExit && (
            <button
              onClick={onExit}
              className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50"
              title="Record Exit"
            >
              <ExitToApp className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard; 