import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { UPDATE_EVENT_MUTATION, GET_EVENT_QUERY } from "../../GraphQLRequests";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

function UpdateEventForm(event) {
  let storage = window.localStorage;
  const initialEvent = JSON.parse(storage.getItem('event'));
  const initialFields = {
    name: initialEvent.name,
    max_participants: initialEvent.max_participants,
    start_location: initialEvent.start_location,
    end_location: initialEvent.end_location,
    event_date: initialEvent.event_date,
  };
  const [fields, setFields] = useState(initialFields);
  const [updatedEventVariable, setUpdatedEventVariable] = useState({
    hasUpdatedEvent: false,
  });

  const { loading, error, data } = useQuery(GET_EVENT_QUERY, { variables: parseInt(initialEvent.id, 10), });

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
        id: parseInt(initialEvent.id),
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
            defaultValue={initialEvent.name}
            placeholder={initialEvent.name}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="maxParticipantsGroup">
          <Form.Label>Max Participants</Form.Label>
          <Form.Control
            type="number"
            defaultValue={initialEvent.max_participants}
            placeholder={initialEvent.max_participants}
            onChange={handleInputChange}
            name="max_participants"
          />
        </Form.Group>
        <Form.Group controlId="startLocationGroup">
          <Form.Label>Start Location</Form.Label>
          <Form.Control
            type="text"
            name="start_location"
            defaultValue={initialEvent.start_location}
            placeholder={initialEvent.start_location}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="endLocationGroup">
          <Form.Label>End Location</Form.Label>
          <Form.Control
            type="text"
            name="end_location"
            defaultValue={initialEvent.end_location}
            placeholder={initialEvent.end_location}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="eventNameGroup">
          <Form.Label>Event Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="event_date"
            defaultValue={new Date(initialEvent.event_date)}
            placeholder={new Date(initialEvent.event_date)}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UpdateEventForm;
