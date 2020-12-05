import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_USER_REGISTRATIONS_QUERY } from "../../GraphQLRequests";
import UserRegisteredEvents from "../RegisteredEvents/UserRegisteredEvents";
import { Context } from "../Store/Store";
import { Redirect } from "react-router";

function UserRegistrations() {
  const [state, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_ALL_USER_REGISTRATIONS_QUERY, {
    variables: { id: state.currentUser },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return `${error}`;

  return (
    <div>
      <div className="content">
        <div className="center-row">
          <h1>Your Registrations</h1>
          <UserRegisteredEvents registrations={data.user.registrations} />
        </div>
      </div>
    </div>
  );
}

export default UserRegistrations;
