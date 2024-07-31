import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const auth = localStorage.getItem("user");

  const conditionForSignup = false; // Change this condition as per your requirement

  if (auth) {
    return <Outlet />;
  } else if (conditionForSignup) {
    return <Navigate to="/signup" />;
  } else {
    return <Navigate to="/login" />;
  }
  // };
  //         }
  //         <Outlet />:<Navigate to="signup"></Navigate>
  //     return
  //     auth? <Outlet />:<Navigate to="signup"></Navigate>
};
export default PrivateRoute;
