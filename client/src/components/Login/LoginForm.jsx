import React, { useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { LOGIN_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";
import { Context } from "../Store/Store";

function LoginForm() {
  const initialFields = {
  };
  const [state, dispatch] = useContext(Context);
  const [fields, setFields] = useState(initialFields);
  const [loginVariables, setLoginVariables] = useState({
    isLoggedIn: false,
    isConfirmed: false,
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    errorPolicy: "all",
  });
  const [loginError, setLoginError] = useState("");

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
    const loginInput = {
      variables: {
        email: fields.email,
        password: fields.password,
      },
    };

    login(loginInput)
      .then((resp) => {
        dispatch({ type: "SET_LOGIN_STATUS", payload: true });
        dispatch({ type: "SET_CURRENT_USER", payload: resp.data.login.id });
        setLoginVariables({
          isLoggedIn: true,
          isConfirmed: resp.data.login.confirmed,
        });
      })
      .catch((err) => setLoginError(err.message));
  };

  const { isLoggedIn, isConfirmed } = loginVariables;
  if (isLoggedIn && isConfirmed) return <Redirect to="/" />;
  if (isLoggedIn && !isConfirmed)
    return <Redirect to={`/activate/${fields.email}`} />;
  return (
    <div>
      {loginError ? <Alert variant="danger">{"Please enter a correct email and password."}</Alert> : undefined}
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

        <Form.Group controlId="passwordGroup">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            onChange={handleInputChange}
            name="password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;
