import React, { useContext } from "react";
import logo from "../../assets/car-theft-64.png";
import reversedlogo from "../../assets/reverse-car-theft-64.png";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Logout from "../Logout/Logout";
import { Context } from "../Store/Store";

function Logo() {
  return (
    <Link to="/">
      <img src={reversedlogo} />
      Campus Carpooling
      <img src={logo} />
    </Link>
  );
}

function AboutLink() {
  return (
    <div className="navbar-right-item">
      <Link to="/about">About</Link>
    </div>
  );
}

function ProfileLink() {
  return (
    <div className="navbar-right-item">
      <Link to="/profile">Profile</Link>
    </div>
  );
}
function LogoutLink() {
  return (
    <div className="navbar-right-item">
      <Logout />
    </div>
  );
}

function LoginLink() {
  return (
    <div className="navbar-right-item">
      <Button>
        <Link to="/login">Log In</Link>
      </Button>
    </div>
  );
}

function Nav() {
  const [state, dispatch] = useContext(Context);

  return (
    <div className="nav">
      <div className="navbar-left-container">
        <Logo />
      </div>
      <div className="navbar-right-container ">
        <AboutLink />
        {state.loggedIn && (
          <>
            <ProfileLink />
            <LogoutLink />
          </>
        )}
        {!state.loggedIn && <LoginLink />}
      </div>
    </div>
  );
}

export default Nav;
