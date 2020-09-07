import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import { LOGOUT_MUTATION } from "../../GraphQLRequests";
import { Context } from "../Store/Store";
import { useMutation } from "@apollo/react-hooks";

function Logout() {
  const [state, dispatch] = useContext(Context);

  const [logout] = useMutation(LOGOUT_MUTATION, {
    errorPolicy: "all",
  });

  function logUserOut() {
    logout().then(() => {
      dispatch({ type: "SET_LOGIN_STATUS", payload: false });
    });
  }

  return <Button onClick={logUserOut}>Log Out</Button>;
}
export default Logout;
