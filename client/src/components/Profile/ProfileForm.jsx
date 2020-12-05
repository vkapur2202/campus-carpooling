import React, { useState, useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { CURRENT_USER_QUERY, PROFILE_MUTATION } from "../../GraphQLRequests";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router";
import { Context } from "../Store/Store";
import { Link } from "react-router-dom";
import ProfileCSS from "./Profile.css";

function ProfileForm() {
  const initialFields = {};
  const [state, dispatch] = useContext(Context);
  const [fields, setFields] = useState(initialFields);
  const [profileVariable, setProfileVariable] = useState({
    hasSetProfile: false,
  });

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  const [profile] = useMutation(PROFILE_MUTATION, {
    errorPolicy: "all",
  });
  const [profileError, setProfileError] = useState("");

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
    const profileInput = {
      variables: {
        ...fields,
        year: fields.year ? fields.year : data.me.year,
        gender: fields.gender ? fields.gender : data.me.gender,
        can_drive: fields.can_drive === "true" ? true : false,
        max_capacity:
          fields.can_drive === "true" && fields.max_capacity
            ? parseInt(fields.max_capacity, 10)
            : data.me.max_capacity,
      },
    };
    profile(profileInput)
      .then((resp) => {
        setProfileVariable({
          hasSetProfile: true,
        });
      })
      .catch((err) => setProfileError(err.message));
  };

  const { hasSetProfile } = profileVariable;
  if (hasSetProfile) return <Redirect to="/" />;

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <div>
      {profileError ? (
        <Alert variant="danger">
          {"Please fill out all of the information"}
        </Alert>
      ) : undefined}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="yearGroup">
          <Form.Label>Year</Form.Label>
          <Form.Control
            as="select"
            name="year"
            defaultValue={data.me ? data.me.year : "Select Year"}
            placeholder={"Select your year"}
            onChange={handleInputChange}
            required
          >
            <option>{"Select Year"}</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Super Senior">Super Senior</option>
            <option value="Graduated">Graduated</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="genderGroup">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            placeholder="Enter your gender"
            defaultValue={data.me ? data.me.gender : "Select Gender"}
            onChange={handleInputChange}
            name="gender"
            required
          >
            <option>Select Gender</option>
            <option value="Man">Man</option>
            <option value="Woman">Woman</option>
            <option value="Non-Binary">Non-Binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to specify">Prefer not to specify</option>
          </Form.Control>
        </Form.Group>

        <Form.Group
          controlId="canDriveGroup"
          defaultValue={data.me ? data.me.can_drive : false}
        >
          <Form.Label>Can you drive?</Form.Label>
          <Form.Check
            type="radio"
            label="Yes"
            name="can_drive"
            onChange={handleInputChange}
            value="true"
            required
          />
          <Form.Check
            type="radio"
            label="No"
            name="can_drive"
            onChange={handleInputChange}
            value="false"
            required
          />
        </Form.Group>

        <Form.Group controlId="maxCapacityGroup">
          <Form.Label>Maximum capacity of your vehicle</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter max capacity"
            defaultValue={data.me ? data.me.max_capacity : "Enter Max Capacity"}
            onChange={handleInputChange}
            name="max_capacity"
            readOnly={fields.can_drive === "false" ? true : false}
            required
          />
        </Form.Group>

        <div className="flex-container">
          <div className="backToHome">
            <Link to="/">Back to Home Page</Link>
          </div>
          <div className="submitButton">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default ProfileForm;
