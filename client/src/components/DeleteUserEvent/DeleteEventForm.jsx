import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { DELETE_EVENT_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

function DeleteEventForm(event) {
  let storage = window.localStorage;
  const initialEvent = JSON.parse(storage.getItem("event"));
  const initialFields = {
    id: initialEvent.id,
  };
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
    errorPolicy: "all",
  });
  const [DeleteEventSuccess, setDeleteEventSuccess] = useState(false);
  const [DeleteEventError, setDeleteEventError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(initialEvent.id);
    const deleteEventInput = {
      variables: {
        event_id: parseInt(initialEvent.id),
      },
    };
    deleteEvent(deleteEventInput)
      .then((resp) => {
        setDeleteEventSuccess(true);
        setTimeout(() => <Redirect to="/" />, 1000);
      })
      .catch((err) => setDeleteEventError(err.message));
  };
  if (DeleteEventError.includes("Event could not be found"))
    return <Redirect to="/" />;
  return (
    <div>
      {DeleteEventError ? (
        <Alert variant="danger">
          {DeleteEventError.replace("GraphQL error: ", "")}
        </Alert>
      ) : undefined}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nameGroup">
          <Form.Label>
            Would you like to delete event {initialEvent.name} from{" "}
            {initialEvent.start_location} to {initialEvent.end_location}?
          </Form.Label>
        </Form.Group>
        <p>{DeleteEventSuccess ? `Your event has been deleted!` : undefined}</p>
        <Button variant="primary" type="submit">
          Delete
        </Button>
        <br />
        <Link to="/" onClick={() => storage.removeItem("event")}>
          Go back to home
        </Link>
      </Form>
    </div>
  );
}

export default DeleteEventForm;
