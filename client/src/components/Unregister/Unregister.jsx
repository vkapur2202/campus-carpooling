import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { UNREGISTER_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";
import "../../App.css";

function Unregister(registration) {
  const currentRegisteredEvent = registration.registration.event;

  console.log(currentRegisteredEvent);
  const [unregister] = useMutation(UNREGISTER_MUTATION, {
    errorPolicy: "all",
  });

  const [hasRegistered, setRegister] = useState(false);

  const [registerError, setRegisterError] = useState("");

  const handleSubmit = (event) => {
    const registerInput = {
      variables: {
        event_id: parseInt(currentRegisteredEvent.id),
      },
    };
    unregister(registerInput)
      .then((resp) => {
        setRegister(true);
      })
      .catch((err) => setRegisterError(err.message));
  };

  // if (hasRegistered) return <Redirect to="/" />;
  return (
    <div>
      {registerError ? (
        <Alert variant="danger">
          {"You are no longer registered for this event"}
        </Alert>
      ) : undefined}

      <div className="content">
        <div className="vertical-content">
          <h1>Unregister from </h1>
          <p>{currentRegisteredEvent.name}</p>
          <p>{currentRegisteredEvent.start_location}</p>
          <p>{currentRegisteredEvent.end_location}</p>
          <p>{currentRegisteredEvent.event_date}</p>
          <p>Are you sure you want to unregister?</p>
          <Button onClick={handleSubmit} variant="primary">
            Unregister
          </Button>{" "}
          {/* <RegistrationConfirmation event={event}/> */}
        </div>
      </div>
    </div>
  );
}

export default Unregister;
