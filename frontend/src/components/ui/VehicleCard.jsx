import { format } from "date-fns";
import { DirectionsCar, Delete, Edit, Verified } from "@mui/icons-material";
import { StatusBadge } from "./";
import useStore from "../../store/useStore";

const VehicleCard = ({
  vehicle,
  onDelete,
  onDispatchChange,
  onEdit,
  onVerify,
  className = "",
}) => {
  const { user } = useStore();
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${className}`}
    >
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
        <div className="flex justify-between items-center">
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
              <p className="font-medium">
                {vehicle.createdBy?.username || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Remarks</p>
              <p className="text-sm line-clamp-2">{vehicle.purpose}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Checkpost</p>
              <p className="text-sm font-medium">
                {vehicle.checkpost?.name} ({vehicle.checkpost?.code})
              </p>
            </div>
            <div>
              <p className="text-gray-500">Dispatch</p>
              <p className="font-medium">
                {vehicle.dispatch && vehicle.dispatchDate
                  ? format(new Date(vehicle?.dispatchDate), "dd/MM/yyyy HH:mm")
                  : "Not Dispatched"}
              </p>
            </div>
          </div>
        </div>

        {/* Dispatch Toggle */}
        <div className="mt-4 flex justify-between items-center border-t pt-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Dispatch:</span>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                checked={vehicle.dispatch}
                onChange={() =>
                  onDispatchChange(vehicle._id, !vehicle.dispatch)
                }
              />
              <div
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition ${
                  vehicle.dispatch ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                    vehicle.dispatch ? "translate-x-6" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>

          {user?.role && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(vehicle)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                title="Edit Entry"
              >
                <Edit className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() => onDelete(vehicle)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                title="Delete Entry"
              >
                {user?.role !== "user" && (
                  <Delete className="w-5 h-5 text-red-600" />
                )}
              </button>
            </div>
          )}

          {(user?.role === "admin" || user?.role === "super_admin") && (
            <button
              onClick={() => onVerify(vehicle.vehicleNumber)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
              title="Verify Vehicle"
            >
              <Verified className="w-5 h-5 text-green-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
