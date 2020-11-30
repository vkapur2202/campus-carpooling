import React from "react";
import ProfileForm from "./ProfileForm";
import "../../App.css";
import { Link } from "react-router-dom";
import ProfileCSS from "./Profile.css";

function Profile() {
  return (
    <div>
      <div className="content">
        <div className="vertical-content2">
          <h1>Profile</h1>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}

export default Profile;
