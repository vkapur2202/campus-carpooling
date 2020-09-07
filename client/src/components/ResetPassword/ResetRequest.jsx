import React from "react";
import ResetRequestForm from "./ResetRequestForm";
import "../../App.css";
import { Link } from "react-router-dom";

function ResetRequest() {
  return (
    <div>
      <div className="content">
        <div className="vertical-content">
          <h1>Reset Request</h1>
          <ResetRequestForm />
          <Link to="/login">Back to login.</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetRequest;
