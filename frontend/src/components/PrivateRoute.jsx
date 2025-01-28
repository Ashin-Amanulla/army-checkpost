import { Navigate } from "react-router-dom";
import useStore from "../store/useStore";

const PrivateRoute = ({ children }) => {
  const { user } = useStore();

  // Check if token is expired (24 hours)
  const isTokenExpired = () => {
    if (!user) return true;
    const tokenDate = new Date(user.tokenCreatedAt || 0);
    const now = new Date();
    const hoursDiff = (now - tokenDate) / (1000 * 60 * 60);
    return hoursDiff >= 24;
  };

  if (isTokenExpired()) {
    useStore.getState().logout();
    return <Navigate to="/login" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
