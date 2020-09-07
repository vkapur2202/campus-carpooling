import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { RESET_PASSWORD_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";

function ResetPasswordForm(props) {
  const token = props.token;

  const initialFields = {
    password: "pass",
    confirm: "pass",
  };
  const [fields, setFields] = useState(initialFields);

  const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION, {
    errorPolicy: "all",
  });

  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState("");

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
        password: fields.password,
        token,
      },
    };

    if (fields.password === fields.confirm) {
      resetPassword(resetRequestInput)
        .then((resp) => {
          setResetPasswordSuccess(true);
        })
        .catch((err) => setResetPasswordError(err.message));
    } else {
      setResetPasswordError("Passwords don't match.");
    }
  };

  if (resetPasswordSuccess) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      {resetPasswordError ? (
        <Alert variant="danger">{resetPasswordError}</Alert>
      ) : undefined}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="passwordGroup">
          <Form.Label>Password</Form.Label>
          <Form.Control
            defaultValue="pass"
            type="password"
            placeholder="Password"
            onChange={handleInputChange}
            name="password"
          />
        </Form.Group>
        <Form.Group controlId="confirmPasswordGroup">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            defaultValue="pass"
            type="password"
            placeholder="Password"
            onChange={handleInputChange}
            name="confirm"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Reset
        </Button>
      </Form>
    </div>
  );
}

export default ResetPasswordForm;
