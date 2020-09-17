import React from "react";
import ProfileForm from "./ProfileForm";
import "../../App.css";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div>
      <div className="content">
        <div className="vertical-content">
          <h1>Profile</h1>
          <ProfileForm />
          <Link to="/">Go back to the home page.</Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
