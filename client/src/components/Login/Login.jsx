import React from "react";
import LoginForm from "./LoginForm";
import "../../App.css";
import { Link } from "react-router-dom";
import LoginCSS from "./Login.css";

function Login() {
  return (
    <div>
      <div className="content">
        <div className="vertical-content2">
          <h1>Login</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
