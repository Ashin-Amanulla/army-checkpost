import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VehicleEntry from "./pages/VehicleEntry";
import VehicleList from "./pages/VehicleList";
import CheckpostManagement from "./pages/CheckpostManagement";
import VehicleTypeManagement from "./pages/VehicleTypeManagement";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import AuditLog from "./pages/AuditLog";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="vehicle-entry" element={<VehicleEntry />} />
            <Route path="vehicle-list" element={<VehicleList />} />

            {/* Protected routes for admin and super_admin only */}
            <Route
              path="checkposts"
              element={
                <PrivateRoute allowedRoles={["super_admin"]}>
                  <CheckpostManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="vehicle-types"
              element={
                <PrivateRoute allowedRoles={["super_admin", "admin"]}>
                  <VehicleTypeManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="reports"
              element={
                <PrivateRoute allowedRoles={["super_admin", "admin"]}>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="users"
              element={
                <PrivateRoute allowedRoles={["super_admin"]}>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="settings"
              element={
                <PrivateRoute allowedRoles={["super_admin", "admin"]}>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="audit-log"
              element={
                <PrivateRoute allowedRoles={["super_admin", "admin"]}>
                  <AuditLog />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
