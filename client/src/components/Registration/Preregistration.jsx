import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { REGISTER_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";
import "../../App.css";
import Moment from "react-moment";
import { Link } from "react-router-dom";

function Registration(event) {
  let storage = window.localStorage;
  const registration = JSON.parse(storage.getItem("event"));

  const [register] = useMutation(REGISTER_MUTATION, {
    errorPolicy: "all",
  });

  const [hasRegistered, setRegister] = useState(false);

  const [registerError, setRegisterError] = useState("");

  const handleSubmit = (event) => {
    const registerInput = {
      variables: {
        event_id: parseInt(registration.id),
      },
    };

    register(registerInput)
      .then((resp) => {
        setRegister(true);
        storage.removeItem('event');
      })
      .catch((err) => {
        setRegisterError(err.message);
        // setTimeout(() => {
        //   setRegister(true);
        // }, 1000);
      });
  };

  if (hasRegistered) return <Redirect to="/" />;
  return (
    <div>
      {registerError ? (
        <Alert variant="danger">
          {"You already pre-registered for this event!"}
        </Alert>
      ) : undefined}

      <div className="content">
        <div className="vertical-content">
          <h1>Register for Event</h1>
          <p>{registration.name}</p>
          <p>{registration.start_location}</p>
          <p>{registration.end_location}</p>
          <p>
            <Moment format="LLL">{registration.event_date}</Moment>
          </p>
          <Button onClick={handleSubmit} variant="primary">
            Pre-Register
          </Button>
          <Link to="/" onClick={() => storage.removeItem('event')}>Go back to home</Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;
