import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes2 = () => {
  const location = useLocation();
  const [fullAccess] = useState(localStorage.getItem("fullAccess"))
  return(
    fullAccess === "true" ? <Outlet /> : <Navigate to="/" replace state={{from: location}} />
  )
}

export default PrivateRoutes2