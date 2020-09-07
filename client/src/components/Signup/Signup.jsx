import React from "react";
import SignupForm from "./SignupForm";
import { Link } from "react-router-dom";
import "../../App.css";

class Signup extends React.Component {
  render() {
    return (
      <div>
        <div className="content">
          <div className="vertical-content">
            <h1>Signup</h1>
            <SignupForm />
            <Link to="/login">Already have an account? Login here.</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
