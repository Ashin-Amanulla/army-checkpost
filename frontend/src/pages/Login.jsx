import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Alert } from "@mui/material";
import useStore from "../store/useStore";
import toast from "react-hot-toast";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(credentials);
      if (success) {
        toast.success("Login successful");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-900 to-green-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl">
        {/* Indian Army Logo */}
        <div className="flex justify-center">
          <img
            src="/indian-army-logo.png"
            alt="Indian Army Logo"
            className="w-24 h-24"
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800">
          CHT CONNECT
        </h1>
        <p className="text-center text-gray-600">CHT Management System</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    username: e.target.value,
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    password: e.target.value,
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">Jai Hind 🇮🇳</div>
        <div className="text-center text-sm text-gray-600">
          {new Date().getFullYear()} © <a href="https://www.xyvin.com" target="_blank" rel="noopener noreferrer">Xyvin</a> & NiMo
        </div>
      </div>
    </div>
  );
}

export default Login;
