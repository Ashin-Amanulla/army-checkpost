import { Navigate, useLocation } from "react-router-dom";
import useStore from "../store/useStore";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const { user, token, checkAuth } = useStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verify();
  }, [checkAuth]);

  if (isChecking) {
    return null; // or a loading spinner
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
