import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import useStore from "../store/useStore";
import toast from "react-hot-toast";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login, isLoading, error } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6">
          <Typography variant="h5" component="h1" className="text-center">
            Army Checkpost System
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  username: e.target.value,
                })
              }
              required
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
              required
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
