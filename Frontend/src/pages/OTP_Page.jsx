import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OTP_Page = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
};

export default OTP_Page;
