import React from "react";
import CreateEventForm from "./CreateEventForm";
import "../../App.css";
import { Link } from "react-router-dom";
import CreateEventCSS from "./CreateEvent.css";

function CreateEvent() {
  return (
    <div>
      <div className="content">
        <div className="vertical-content5">
          <h1>Create an Event</h1>
          <CreateEventForm />
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;
