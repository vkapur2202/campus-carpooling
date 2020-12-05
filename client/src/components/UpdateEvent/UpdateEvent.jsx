import React from "react";
import UpdateEventForm from "./UpdateEventForm";
import "../../App.css";
import { Link } from "react-router-dom";

function UpdateEvent() {
  let storage = window.localStorage;

  const event = storage.getItem('event');
  return (
    <div>
      <div className="content">
        <div className="vertical-content2">
          <h1>Update Event</h1>
          <UpdateEventForm event={event} />
        </div>
      </div>
    </div>
  );
}

export default UpdateEvent;
