import React, { useState } from "react";
import { ACTIVATE_ACCOUNT_MUTATION } from "../../GraphQLRequests";
import Button from "react-bootstrap/Button";
import { useMutation } from "@apollo/react-hooks";
import "../../App.css";
import ActivateAccountCSS from "./ActivateAccount.css";

function ActivateAccount(props) {
  const email = props.match.params.email;

  const {isEmailSent, setIsEmailSent} = useState(false);
  const {activateMutationError, setActivateMutationError} = useState("");

  const [activate] = useMutation(ACTIVATE_ACCOUNT_MUTATION, {
    errorPolicy: "all",
  });

  function activateAccount() {
    activate()
      .then(() => {
        setIsEmailSent(true);
      })
      .catch((err) => {
        console.log(err.message);
        setActivateMutationError(err.message);
      });
  }

  if (isEmailSent) return <p>An email was sent to {email}</p>;
  if (activateMutationError) return <p>{activateMutationError}</p>;

  return (
    <div className="content">
      <div className="vertical-content1">
        <h2>Activate Your Account</h2> <br />
        <Button onClick={activateAccount}>Send email confirmation</Button>
      </div>
    </div>
  );
}

export default ActivateAccount;
