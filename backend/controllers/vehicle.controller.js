const { ca } = require("date-fns/locale");
const VehicleEntry = require("../models/Vehicle");

const vehicleController = {
  // Create new vehicle entry
  createEntry: async (req, res) => {
    try {
 

      // Validate required fields
      if (
        !req.body.vehicleNumber ||
        !req.body.vehicleType ||
        !req.body.driverName ||
        !req.body.driverPhone ||
        !req.body.purpose
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const checkVehicleNumber = await VehicleEntry.findOne({
        vehicleNumber: req.body.vehicleNumber,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }).populate("checkpost");
      if (checkVehicleNumber) {
        return res.status(400).json({
          success: false,
          message: `Vehicle already entered today at ${
            checkVehicleNumber.checkpost.name
          } at ${checkVehicleNumber.createdAt.toLocaleString()}`,
        });
      }

      const entry = await VehicleEntry.create({
        vehicleNumber: req.body.vehicleNumber,
        vehicleType: req.body.vehicleType,
        driverName: req.body.driverName,
        driverPhone: req.body.driverPhone,
        purpose: req.body.purpose,
        createdBy: req.user._id,
        checkpost: req.body.checkpost || req.user.checkpost,
        photoUrl: req.file
          ? req.file.location || `/uploads/${req.file.filename}`
          : null,
        dispatch: req.body.dispatch === "true" || req.body.dispatch === true,
        dispatchDate:
          req.body.dispatch === "true" || req.body.dispatch === true
            ? new Date()
            : null,
      });

      const populatedEntry = await VehicleEntry.findById(entry._id)
        .populate("vehicleType", "name")
        .populate("checkpost", "name code")
        .populate({
          path: "createdBy",
          select: "username fullName active",
        });

      res.status(201).json({
        success: true,
        data: populatedEntry,
      });
    } catch (error) {
      console.error("Error in createEntry:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get all vehicle entries with filters
  getEntries: async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        vehicleType,
        vehicleNumber,
        status,
        checkpost,
        search,
        page = 1,
        limit = 10,
      } = req.query;
      console.log(req.query);
      let query = {};

      // Date filter
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      // Other filters
      if (vehicleType) query.vehicleType = vehicleType;
      if (vehicleNumber) query.vehicleNumber = vehicleNumber;
      if (status) query.dispatch = status;
      if (checkpost) query.checkpost = checkpost;
      if (search) {
        query.$or = [
          { vehicleNumber: new RegExp(search, "i") },
          { driverName: new RegExp(search, "i") },
          { driverPhone: new RegExp(search, "i") },
          { purpose: new RegExp(search, "i") },
        ];
      }

      // Checkpost restriction for regular users
      if (req.user.role === "user") {
        query.checkpost = req.user.checkpost;
      }

      const pageNumber = Math.max(Number(page) || 1, 1);
      const limitNumber = Math.max(Number(limit) || 10, 1);

      const skip = (pageNumber - 1) * limitNumber;

      const [entries, total] = await Promise.all([
        VehicleEntry.find(query)
          .populate("vehicleType", "name")
          .populate("checkpost", "name code location")
          .populate({
            path: "createdBy",
            select: "username fullName active",
          })
          .sort("-createdAt")
          .skip(skip)
          .limit(limitNumber),
        VehicleEntry.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: entries,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get single entry by ID
  getEntryById: async (req, res) => {
    try {
      const entry = await VehicleEntry.findById(req.params.id)
        .populate("vehicleType", "name")
        .populate("checkpost", "name code location")
        .populate({
          path: "createdBy",
          select: "username fullName active",
        });

      if (!entry) {
        return res.status(404).json({
          success: false,
          message: "Entry not found",
        });
      }

      res.json({
        success: true,
        data: entry,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get vehicle history by vehicle number
  getVehicleHistory: async (req, res) => {
    try {
      const entries = await VehicleEntry.find({
        vehicleNumber: new RegExp(req.params.vehicleNumber, "i"),
      })
        .populate("vehicleType", "name")
        .populate("checkpost", "name code")
        .populate({
          path: "createdBy",
          select: "username fullName active",
        })
        .sort("-createdAt");

      res.json({
        success: true,
        data: entries,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Handle photo upload
  uploadPhoto: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const photoUrl = req.file.location || `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        data: { photoUrl },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to upload photo",
      });
    }
  },

  deleteEntry: async (req, res) => {
    try {
      const entry = await VehicleEntry.findById(req.params.id);

      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      const deleteEntry = await VehicleEntry.findByIdAndDelete(req.params.id);

      res.json(deleteEntry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  exitEntry: async (req, res) => {
    try {
      const entry = await VehicleEntry.findById(req.params.id);
      const { status: dispatch } = req.body;
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      const data = {
        dispatch,
      };

      if (dispatch) {
        data.dispatchDate = Date.now();
      }

      const exitEntry = await VehicleEntry.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
      );

      res.json(exitEntry);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createVehicle: async (req, res) => {
    try {
      const { vehicleNumber, vehicleType, checkpost } = req.body;

      const vehicle = new VehicleEntry({
        vehicleNumber,
        vehicleType,
        checkpost: checkpost || req.user.checkpost,
        createdBy: req.user._id,
      });

      await vehicle.save();

      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  getVehicles: async (req, res) => {
    try {
      const checkpostFilter = ["super_admin", "admin"].includes(req.user.role)
        ? {}
        : { checkpost: req.user.checkpost };

      const vehicles = await VehicleEntry.find(checkpostFilter)
        .populate("vehicleType", "name")
        .populate("checkpost", "name code")
        .populate("createdBy", "username")
        .sort("-createdAt");

      res.json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  updateVehicle: async (req, res) => {
    try {
      const { id } = req.params;
      const { vehicleNumber, driverName, driverPhone, purpose } = req.body;
      console.log("dasdas", req.body);

      // Find vehicle and check if it exists
      const vehicle = await VehicleEntry.findById(id);
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle entry not found",
        });
      }
      // Update only allowed fields
      const updatedVehicle = await VehicleEntry.findByIdAndUpdate(
        id,
        {
          vehicleNumber,
          driverName,
          driverPhone,
          purpose,
        },
        { new: true }
      )
        .populate("vehicleType")
        .populate("checkpost")
        .populate("createdBy", "username");

      res.json({
        success: true,
        data: updatedVehicle,
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = vehicleController;
