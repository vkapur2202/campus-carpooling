import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { RESET_REQUEST_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";

function ResetRequestForm() {
  const initialFields = {
    email: "nkk1@rice.edu",
  };
  const [fields, setFields] = useState(initialFields);

  const [resetRequest] = useMutation(RESET_REQUEST_MUTATION, {
    errorPolicy: "all",
  });
  const [resetRequestSuccess, setResetRequestSuccess] = useState(false);
  const [resetRequestError, setResetRequestError] = useState("");

  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value.trim();

    const newFields = {
      ...fields,
      [name]: value,
    };

    setFields(newFields);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const resetRequestInput = {
      variables: {
        email: fields.email,
      },
    };
    resetRequest(resetRequestInput)
      .then((resp) => {
        setResetRequestSuccess(true);
      })
      .catch((err) => setResetRequestError(err.message));
  };

  return (
    <div>
      {resetRequestError ? (
        <Alert variant="danger">{resetRequestError}</Alert>
      ) : undefined}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nameGroup">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={handleInputChange}
            name="email"
          />
        </Form.Group>
        <p>
          {resetRequestSuccess
            ? `An email with a reset token has been sent to ${fields.email}!`
            : undefined}
        </p>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ResetRequestForm;
