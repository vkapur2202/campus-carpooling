import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import "../../App.css";
import { Link } from "react-router-dom";

function ResetPassword(props) {
  return (
    <div>
      <div className="content">
        <div className="vertical-content">
          <h1>Reset Password</h1>
          <ResetPasswordForm token={props.match.params.token} />
          <Link to="/login">Back to login.</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
