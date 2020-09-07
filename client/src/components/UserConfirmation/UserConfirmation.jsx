import React, { useEffect } from "react";
import "../../App.css";
import { CONFIRM_ACCOUNT_MUTATION } from "../../GraphQLRequests";
import { useMutation } from "@apollo/react-hooks";
import { useState } from "react";
import { Link } from "react-router-dom";

function RedirectToLogin() {
  return (
    <div>
      <p>
        Seems like the token is invalid or expired. Please log in again so we
        can re-send the confirmation email:
      </p>
      <Link to="/login">Login</Link>
    </div>
  );
}

function UserConfirmation(props) {
  const [confirm] = useMutation(CONFIRM_ACCOUNT_MUTATION, {
    errorPolicy: "all",
    variables: {
      token: props.match.params.token,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

  useEffect(() => {
    confirm()
      .then(() => {
        setConfirmSuccess(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Checking if you've activated your account...</p>;

  return (
    <div className="content">
      <div className="vertical-content">
        <h1>Confirmation</h1>
        <RedirectToLogin />
      </div>
    </div>
  );
}

export default UserConfirmation;
