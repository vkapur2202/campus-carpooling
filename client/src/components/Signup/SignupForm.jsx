import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { SIGNUP_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { useState } from "react";
import { Redirect } from "react-router";

function SignupForm() {
  const initialFields = {
    name: "Namanh Kapur",
    email: "nkk1@rice.edu",
    password: "pass",
    confirm: "pass",
  };
  const [fields, setFields] = useState(initialFields);
  const [hasSignedUp, setHasSignedUp] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signup] = useMutation(SIGNUP_MUTATION, {
    errorPolicy: "all",
  });

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

    const signupInput = {
      variables: {
        name: fields.name,
        email: fields.email,
        password: fields.password,
      },
    };
    if (fields.password === fields.confirm) {
      signup(signupInput)
        .then(() => {
          setHasSignedUp(true);
        })
        .catch((err) => {
          setSignUpError(err.message);
        });
    } else {
      setSignUpError("Passwords don't match.");
    }
  };

  if (hasSignedUp) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      {signUpError ? <Alert variant="danger">{signUpError}</Alert> : undefined}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nameGroup">
          <Form.Label>Full name</Form.Label>
          <Form.Control
            defaultValue="Namanh Kapur"
            type="text"
            placeholder="e.g. John Doe"
            onChange={handleInputChange}
            name="name"
          />
        </Form.Group>

        <Form.Group controlId="emailGroup">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            defaultValue="nkk1@rice.edu"
            type="email"
            placeholder="Enter email"
            onChange={handleInputChange}
            name="email"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

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
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            defaultValue="pass"
            type="password"
            placeholder="Password"
            onChange={handleInputChange}
            name="confirm"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default SignupForm;
