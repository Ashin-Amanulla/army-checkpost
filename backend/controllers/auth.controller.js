const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { username, password, email, role, checkpost } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }

      // Create new user
      const user = await User.create({
        username,
        password,
        email,
        role: role || "user",
        checkpost,
      });

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            checkpost: user.checkpost,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ username })
        .select("+password")
        .populate("checkpost", "name code");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            checkpost: user.checkpost,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get current user
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate(
        "checkpost",
        "name code"
      );

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, password } = req.body;
      const updateData = { fullName };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
      }).populate("checkpost", "name code");

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Get all users (admin only)
  getUsers: async (req, res) => {
    try {
      const { search = "", checkpost = "", role = "", status = "" } = req.query;
      // Only super_admin can see all users, admin can only see users of their checkpost
      const query =
        req.user.role === "super_admin"
          ? {}
          : { checkpost: req.user.checkpost };

      query.role = { $ne: "super_admin" };

      if (search) {
        query.$or = [{ username: { $regex: search, $options: "i" } }];
      }

      if (checkpost) {
        query.checkpost = checkpost;
      }

      if (role) {
        query.role = role;
      }

      if (status) {
        query.status = status;
      }

      const users = await User.find(query)
        .populate("checkpost", "name code")
        .select("-password")
        .sort("-createdAt");

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Error in getUsers:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = authController;
