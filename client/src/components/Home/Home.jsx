import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Home() {
  return (
    <div>
      <div className="content">
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
      </div>
    </div>
  );
}

export default Home;
