import React from "react";
import LoginForm from "./LoginForm";
import "../../App.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <div className="content">
        <div className="vertical-content">
          <h1>Login</h1>
          <LoginForm />
          <Link to="/signup">Don't have an account? Sign up here.</Link>
          <Link to="/reset_request">Forgot your password? Reset here.</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
