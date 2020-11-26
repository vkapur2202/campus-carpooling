import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_EVENTS_QUERY } from "../../GraphQLRequests";
import ActiveEvents from "../Events/ActiveEvents";
import InactiveEvents from "../Events/InactiveEvents";
import { Context } from "../Store/Store";
import { Redirect } from "react-router";
import HomeCSS from "./Home.css";

function Home() {
  const [state, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_ALL_EVENTS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  if (loading) return <p>Loading...</p>;
  if (error) return `${error}`;
  return (
    <div>
      <div className="content">
        {!state.loggedIn && (
          <div className="vertical-content">
            <h1>Home</h1>
            <p>Welcome to the Home page!</p>
            <p>Sign up or login to get started!</p>

            <Link to="/signup" className="nav-button">
              <Button variant="primary" size="lg">
                Sign Up
            </Button>
            </Link>
            <Link to="/login" className="nav-button">
              <Button variant="primary" size="lg">
                Login
            </Button>
            </Link>
          </div>
        )}
        <div className="center-row">
          {state.loggedIn && <ActiveEvents events={data.activeEvents} />}
          {state.loggedIn && <InactiveEvents events={data.inactiveEvents} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
