import React from "react";
import CreateEventForm from "./CreateEventForm";
import "../../App.css";
import { Link } from "react-router-dom";

function CreateEvent() {
  return (
    <div>
      <div className="content">
        <div className="vertical-content">
          <h1>Create an Event</h1>
          <CreateEventForm />
          <Link to="/">Go back to the home page.</Link>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
