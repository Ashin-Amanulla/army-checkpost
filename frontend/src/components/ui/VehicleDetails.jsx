import { CheckpostBadge } from "./";

const VehicleDetails = ({ vehicle, className = "" }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Vehicle Number</h3>
          <p className="mt-1 text-lg text-gray-900">{vehicle.vehicleNumber}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Vehicle Type</h3>
          <p className="mt-1 text-lg text-gray-900">
            {vehicle.vehicleType?.name}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Driver Name</h3>
          <p className="mt-1 text-lg text-gray-900">{vehicle.driverName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Driver Phone</h3>
          <p className="mt-1 text-lg text-gray-900">{vehicle.driverPhone}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Entry Time</h3>
          <p className="mt-1 text-lg text-gray-900">
            {new Date(vehicle.entryTime).toLocaleString()}
          </p>
        </div>
        {vehicle.exitTime && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Exit Time</h3>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(vehicle.exitTime).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Checkpost</h3>
        <div className="mt-1">
          <CheckpostBadge
            name={vehicle.checkpost?.name}
            code={vehicle.checkpost?.code}
          />
        </div>
      </div>

      {vehicle.purpose && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Purpose</h3>
          <p className="mt-1 text-lg text-gray-900">{vehicle.purpose}</p>
        </div>
      )}

      {vehicle.photoUrl && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Vehicle Photo</h3>
          <img
            src={vehicle.photoUrl}
            alt="Vehicle"
            className="mt-2 max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
