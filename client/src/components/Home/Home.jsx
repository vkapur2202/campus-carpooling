import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useQuery } from "@apollo/react-hooks";
import { GET_ALL_ACTIVE_EVENTS_QUERY } from "../../GraphQLRequests";
import Events from "../Events/Events";
import { Context } from "../Store/Store";
import { Redirect } from "react-router";

function Home() {
  const [state, dispatch] = useContext(Context);
  const { loading, error, data } = useQuery(GET_ALL_ACTIVE_EVENTS_QUERY, {
    // put options here
  });

  if (loading) return <p>Loading...</p>;
  if (error) return `${error}`;
  console.log(data);
  return (
    <div>
      <div className="content">
        {!state.loggedIn && (
          <div className="vertical-content">
            <h1>Home</h1>
            <p>Welcome to the Home page!</p>
            <p>Sign up or login to get started!</p>
            <Button variant="primary" size="lg">
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button variant="primary" size="lg">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        )}
        {state.loggedIn && <Events events={data.activeEvents} />}
      </div>
    </div>
  );
}

export default Home;
