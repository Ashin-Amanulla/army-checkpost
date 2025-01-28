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

function App() {
  return (
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
          <Route path="checkposts" element={<CheckpostManagement />} />
          <Route path="vehicle-types" element={<VehicleTypeManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
