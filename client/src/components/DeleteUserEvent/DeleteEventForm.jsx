import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { DELETE_EVENT_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";

function DeleteEventForm(event) {
    const initialEvent = event.event.event;
    const initialFields = {
        id: initialEvent.id
    };
    const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
        errorPolicy: "all",
    });
    const [DeleteEventSuccess, setDeleteEventSuccess] = useState(false);
    const [DeleteEventError, setDeleteEventError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(initialEvent.id)
        const deleteEventInput = {
            variables: {
                event_id: parseInt(initialEvent.id)
            },
        };
        deleteEvent(deleteEventInput)

            .then((resp) => {
                setDeleteEventSuccess(true);
            })
            .catch((err) => setDeleteEventError(err.message));
    };

    return (
        <div>
            {DeleteEventError ? (
                <Alert variant="danger">{DeleteEventError}</Alert>
            ) : undefined}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="nameGroup">
                    <Form.Label>Would you like to delete event {initialEvent.name} from {initialEvent.start_location} to {initialEvent.end_location}?</Form.Label>
                </Form.Group>
                <p>
                    {DeleteEventSuccess
                        ? `Your event has been deleted!`
                        : undefined}
                </p>
                <Button variant="primary" type="submit">
                    Delete
        </Button>
            </Form>
        </div>
    );
}

export default DeleteEventForm;
