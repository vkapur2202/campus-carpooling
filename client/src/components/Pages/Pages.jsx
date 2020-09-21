import React from "react";
import { Switch, Route } from "react-router-dom";
import "../../App.css";
import Home from "../Home/Home";
import About from "../About/About";
import Profile from "../Profile/Profile";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import ActivateAccount from "../ActivateAccount/ActivateAccount";
import UserConfirmation from "../UserConfirmation/UserConfirmation";
import ResetRequest from "../ResetPassword/ResetRequest";
import ResetPassword from "../ResetPassword/ResetPassword";
import CreateEvent from "../CreateEvent/CreateEvent";

function Pages() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/profile" component={Profile} />
      <Route path="/create_event" component={CreateEvent} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/reset_request" component={ResetRequest} />
      <Route path="/activate/:email" component={ActivateAccount} />
      <Route path="/confirm/:token" component={UserConfirmation} />
      <Route path="/reset_password/:token" component={ResetPassword} />
    </Switch>
  );
}

export default Pages;
