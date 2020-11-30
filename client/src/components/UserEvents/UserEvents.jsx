import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_USER_EVENTS_QUERY } from "../../GraphQLRequests";
import UserActiveEvents from "../Events/UserActiveEvents";
import UserInactiveEvents from "../Events/UserInactiveEvents";
import { Context } from "../Store/Store";
import { Redirect } from "react-router";
import UserEventsCSS from "./UserEvents.css";

function UserEvents() {
  const [state, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_ALL_USER_EVENTS_QUERY, {
    variables: { id: state.currentUser },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return `${error}`;

  return (
    <div>
      <div className="content">
        <div className="center-row">
          <h1>Your Events</h1>

          <br />
          <div className="activeEventsTable">
            <UserActiveEvents
              events={data.user.active_events}
              className="table"
            />{" "}
          </div>
          <div className="inactiveEventsTable">
            <UserInactiveEvents
              events={data.user.inactive_events}
              className="table"
            />
          </div>
          <div className="eventButton">
            <Link to="/create_event">
              <Button variant="primary" size="lg">
                Create New Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEvents;
