import React from "react";
import DeleteEventForm from "./DeleteEventForm";
import "../../App.css";
import { Link } from "react-router-dom";

function DeleteEvent(event) {
  return (
    <div>
      <div className="content">
        <div className="vertical-content3">
          <h1>Delete Event</h1>
          <DeleteEventForm event={event} />
        </div>
      </div>
    </div>
  );
}

export default DeleteEvent;
