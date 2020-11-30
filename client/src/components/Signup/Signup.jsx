import React from "react";
import SignupForm from "./SignupForm";
import { Link } from "react-router-dom";
import "../../App.css";
import SignUpCSS from "./SignUp.css";

class Signup extends React.Component {
  render() {
    return (
      <div>
        <div className="content">
          <div className="vertical-content2">
            <h1>Sign Up</h1>
            <SignupForm />
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
