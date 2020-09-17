import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { PROFILE_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";

function ProfileForm() {
  const initialFields = {
  };
  const [fields, setFields] = useState(initialFields);
  const [profileVariable, setProfileVariable] = useState({
    hasSetProfile: false,
  });

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
        year: fields.year,
        gender: fields.gender,
        can_drive: fields.can_drive == "true" ? true : false,
        max_capacity: fields.can_drive == "true" ? parseInt(fields.max_capacity, 10) : 0,
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

  return (
    <div>
      {profileError ? (
        <Alert variant="danger">{profileError}</Alert>
      ) : undefined}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="yearGroup">
          <Form.Label>Year</Form.Label>
          <Form.Control
            as="select"
            name="year"
            placeholder="Select your year"
            onChange={handleInputChange}
          >
            <option>Select Year</option>
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
            onChange={handleInputChange}
            name="gender"
          >
            <option>Select Gender</option>
            <option value="Man">Man</option>
            <option value="Woman">Woman</option>
            <option value="Non-Binary">Non-Binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to specify">Prefer not to specify</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="canDriveGroup">
          <Form.Label>Can you drive?</Form.Label>
          <Form.Check
            type="radio"
            label="Yes"
            name="can_drive"
            onChange={handleInputChange}
            value="true"
          />
          <Form.Check
            type="radio"
            label="No"
            name="can_drive"
            onChange={handleInputChange}
            value="false"
          />
        </Form.Group>
        <Form.Group controlId="maxCapacityGroup">
          <Form.Label>Maximum capacity of your vehicle</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter max capacity"
            onChange={handleInputChange}
            name="max_capacity"
            readOnly={fields.can_drive == "false" ? true : false}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ProfileForm;
