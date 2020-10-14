import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { UPDATE_EVENT_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";

function UpdateEventForm() {
  const initialFields = {};
  const [fields, setFields] = useState(initialFields);
  const [updatedEventVariable, setUpdatedEventVariable] = useState({
    hasupdatedEvent: false,
  });

  const [updateEvent] = useMutation(UPDATE_EVENT_MUTATION, {
    errorPolicy: "all",
  });
  const [updateEventError, setUpdateEventError] = useState("");

  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const newFields = {
      ...fields,
      [name]: value,
    };
    setFields(newFields);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updateEventInput = {
      variables: {
        name: fields.name,
        max_participants: parseInt(fields.max_participants),
        start_location: fields.start_location,
        end_location: fields.end_location,
        event_date: new Date(fields.event_date),
      },
    };
    updateEvent(updateEventInput)
      .then((resp) => {
        setUpdatedEventVariable({
          hasUpdatedEvent: true,
        });
      })
      .catch((err) => setUpdateEventError(err.message));
    console.log(updateEventInput);
  };

  const { hasUpdatedEvent } = updatedEventVariable;
  if (hasUpdatedEvent) return <Redirect to="/" />;
  return (
    <div>
      {updateEventError ? (
        <Alert variant="danger">{updateEventError}</Alert>
      ) : undefined}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="eventNameGroup">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter a name for your event"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="maxParticipantsGroup">
          <Form.Label>Max Participants</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter the maximum amount of participants"
            onChange={handleInputChange}
            name="max_participants"
          />
        </Form.Group>
        <Form.Group controlId="startLocationGroup">
          <Form.Label>Start Location</Form.Label>
          <Form.Control
            type="text"
            name="start_location"
            placeholder="Enter your starting location"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="endLocationGroup">
          <Form.Label>End Location</Form.Label>
          <Form.Control
            type="text"
            name="end_location"
            placeholder="Enter your end location"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="eventNameGroup">
          <Form.Label>Event Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="event_date"
            placeholder="Enter a date and time"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default updateEventForm;
