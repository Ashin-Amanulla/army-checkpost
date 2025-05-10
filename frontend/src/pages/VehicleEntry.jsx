import { useState, useEffect } from "react";
import { DirectionsCar, CheckCircle } from "@mui/icons-material";
import { vehicleAPI, checkpostAPI } from "../services/api";
import { PhotoCamera } from "@mui/icons-material";
import toast from "react-hot-toast";
import useStore from "../store/useStore";

function VehicleEntry() {
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "",
    driverName: "",
    driverPhone: "",
    purpose: "",
    photo: null,
    checkpost: user.role === "user" ? user.checkpost : "",
    dispatch: false,
  });
  const [checkposts, setCheckposts] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchVehicleTypes(),
          user.role !== "user" ? fetchCheckposts() : Promise.resolve(),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]);

  const fetchVehicleTypes = async () => {
    try {
      const response = await vehicleAPI.types.getAll();
      if (response) {
        const data = response.filter((item) => item.active === true);
        setVehicleTypes(data);
      }
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      toast.error("Failed to load vehicle types");
      setVehicleTypes([]);
    }
  };

  const fetchCheckposts = async () => {
    try {
      const response = await checkpostAPI.getAll();
      if (response) {
        const data = response.filter((item) => item.active === true);
        setCheckposts(data);
      } else {
        setCheckposts([]);
      }
    } catch (error) {
      console.error("Error fetching checkposts:", error);
      toast.error("Failed to fetch checkposts");
      setCheckposts([]);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Debug logs
      console.log("Original form data:", {
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicleType,
        driverName: formData.driverName,
        driverPhone: formData.driverPhone,
        purpose: formData.purpose,
        checkpost: formData.checkpost,
        photo: formData.photo,
        dispatch: formData.dispatch,
      });

      // Append all form fields
      if (formData.vehicleNumber)
        formDataToSend.append("vehicleNumber", formData.vehicleNumber.trim());
      if (formData.vehicleType)
        formDataToSend.append("vehicleType", formData.vehicleType);
      if (formData.driverName)
        formDataToSend.append("driverName", formData.driverName.trim());
      if (formData.driverPhone)
        formDataToSend.append("driverPhone", formData.driverPhone.trim());
      if (formData.purpose)
        formDataToSend.append("purpose", formData.purpose.trim());

      // Append dispatch status
      formDataToSend.append("dispatch", formData.dispatch);

      // Append checkpost if user is not a regular user
      if (user.role !== "user") {
        if (formData.checkpost)
          formDataToSend.append("checkpost", formData.checkpost);
      } else {
        // For regular users, use their assigned checkpost
        formDataToSend.append("checkpost", user.checkpost);
      }

      // Append photo if exists
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo, formData.photo.name);
      }

      // Debug: Log all FormData entries
      console.log("FormData contents:");
      for (let pair of formDataToSend.entries()) {
        console.log(
          `${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`
        );
      }

      const response = await vehicleAPI.entries.createEntry(formDataToSend);
      console.log("Server response:", response);

      toast.success("Vehicle entry created successfully");
      // Reset form
      setFormData({
        vehicleNumber: "",
        vehicleType: "",
        driverName: "",
        driverPhone: "",
        purpose: "",
        photo: null,
        checkpost: user.role === "user" ? user.checkpost : "",
        dispatch: false,
      });
      setPhotoPreview(null);
    } catch (error) {
      console.error("Error creating entry:", error);
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Failed to create entry");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-green-900 text-white px-8 py-6">
            <h2 className="text-xl font-semibold">New Vehicle Entry</h2>
            <p className="text-sm text-green-100 mt-2 opacity-90">
              Enter vehicle and driver information for checkpoint entry
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Vehicle Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Vehicle Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicleNumber: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 placeholder-gray-400"
                    placeholder="Enter vehicle number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicleType: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-600"
                    required
                  >
                    <option value="">Select vehicle type</option>
                    {Array.isArray(vehicleTypes) &&
                      vehicleTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Checkpost *
                  </label>
                  {user.role !== "user" ? (
                    <select
                      value={formData.checkpost}
                      onChange={(e) =>
                        setFormData({ ...formData, checkpost: e.target.value })
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-600"
                      required
                    >
                      <option value="">Select checkpoint location</option>
                      {Array.isArray(checkposts) &&
                        checkposts.map((checkpost) => (
                          <option key={checkpost._id} value={checkpost._id}>
                            {checkpost.name} ({checkpost.code})
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div>{user.checkpost.code}</div>
                  )}
                </div>

                {/* Dispatch Toggle */}
                <div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                      Dispatch Status
                    </label>

                    <div className="relative inline-block w-12 align-middle select-none mt-1">
                      <input
                        type="checkbox"
                        id="toggle"
                        checked={formData.dispatch}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            dispatch: !formData.dispatch,
                          })
                        }
                        className="hidden"
                      />
                      <label
                        htmlFor="toggle"
                        className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white border border-gray-300 shadow transform transition-transform duration-200 ease-in ${
                            formData.dispatch
                              ? "translate-x-6 bg-green-500"
                              : "translate-x-0 bg-red-500"
                          }`}
                        />
                      </label>
                    </div>

                    <span
                      className={`text-sm font-medium ${
                        formData.dispatch ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {formData.dispatch ? "Dispatched" : "Not Dispatched"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Toggle if the vehicle is dispatched immediately upon entry
                  </p>
                </div>
              </div>
            </div>

            {/* Driver Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Driver Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    value={formData.driverName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        driverName: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 placeholder-gray-400"
                    placeholder="Enter driver's full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.driverPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        driverPhone: e.target.value,
                      })
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 placeholder-gray-400"
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Purpose & Photo Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                Additional Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks *
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purpose: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 placeholder-gray-400"
                  placeholder="Enter Remarks"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Photo *
                </label>
                <div className="mt-2 flex flex-col items-center justify-center px-6 py-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors duration-200">
                  {photoPreview ? (
                    <div className="space-y-2">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setFormData({ ...formData, photo: null });
                        }}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove photo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <PhotoCamera className="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                          <span>Upload a photo</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            required={!formData.photo}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Click or drag and drop to upload
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 border-t pt-6">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Create Entry</span>
                    {formData.dispatch && <CheckCircle className="w-4 h-4" />}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default VehicleEntry;
