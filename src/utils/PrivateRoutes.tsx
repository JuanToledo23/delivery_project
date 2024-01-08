import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = () => {
  const location = useLocation();
  const [login] = useState(localStorage.getItem("login"))
  return(
    login === "true" ? <Outlet /> : <Navigate to="/" replace state={{from: location}} />
  )
}

export default PrivateRoutes