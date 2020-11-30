import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";
import { REGISTER_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router";
import "../../App.css";

function Registration(event) {
    const registration = event.event

    const [register] = useMutation(REGISTER_MUTATION, {
        errorPolicy: "all",
    });

    const [hasRegistered, setRegister] = useState(false);

    const [registerError, setRegisterError] = useState("");

    const handleSubmit = (event) => {
        const registerInput = {
            variables: {
                event_id: parseInt(registration.id),
            }
        }
        register(registerInput)
            .then((resp) => {
                setRegister(true);
            })
            .catch((err) => setRegisterError(err.message));
    };

    return (
        <div>
            {registerError ? (
                <Alert variant="danger">{"You already registered for this event!"}</Alert>
            ) : undefined}

            <div className="content">
                <div className="vertical-content">

                    <h1>Register for Event</h1>
                    <p>
                        {registration.name}
                    </p>
                    <p>
                        {registration.start_location}
                    </p>
                    <p>
                        {registration.end_location}
                    </p>
                    <p>
                        {registration.event_date}
                    </p>
                    <Button onClick={handleSubmit} variant="primary">Register</Button>{' '}

                    {/* <RegistrationConfirmation event={event}/> */}
                </div>
            </div>
        </div>

    );
}



export default Registration;

