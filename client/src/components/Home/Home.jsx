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
import { Container } from "react-bootstrap";

function Home() {
  const [state, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_ALL_EVENTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return `${error}`;
  return (
    <Container className="p-0 py-0" fluid={true}>
      <div className="content">
        {!state.loggedIn && (
          <div className="vertical-content1">
            <h2>Welcome to the Home page</h2>
            <h2>Sign up or login to get started</h2>
            <br />
            <br />
            <div className="homebuttons">
              <Link to="/signup">
                <Button variant="primary" size="lg" className="nav-button">
                  Sign Up
                </Button>
              </Link>
              <br />
              <br />
              <Link to="/login">
                <Button variant="primary" size="lg" className="nav-button">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}

        {state.loggedIn ? (
          <div className="center-row">
            <h1>All Events</h1> 
            {state.loggedIn && <ActiveEvents events={data.activeEvents} />}
            {state.loggedIn && <InactiveEvents events={data.inactiveEvents} />}
          </div>
        ) : null}
      </div>
    </Container>
  );
}

export default Home;
