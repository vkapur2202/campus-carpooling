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
import UserEvents from "../UserEvents/UserEvents";
import UpdateUserEvent from "../UpdateEvent/UpdateEvent";
import UpdateEventForm from "../UpdateEvent/UpdateEventForm";
import Registration from "../Registration/Registration";
import Preregistration from "../Registration/Preregistration";
import UserRegistrations from "../UserRegistrations/UserRegistrations";
import Unregister from "../Unregister/Unregister";
import DeleteEvent from "../DeleteUserEvent/DeleteEvent";

function Pages() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/profile" component={Profile} />
      <Route path="/create_event" component={CreateEvent} />
      <Route path="/update_event/:event_name" component={UpdateUserEvent} />
      <Route path="/registration" component={Registration} />
      <Route path="/registered_events" component={UserRegistrations} />
      <Route path="/your_events" component={UserEvents} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/reset_request" component={ResetRequest} />
      <Route path="/activate/:email" component={ActivateAccount} />
      <Route path="/confirm/:token" component={UserConfirmation} />
      <Route path="/reset_password/:token" component={ResetPassword} />
      <Route path="/register/:registration_name" component={Registration} />
      <Route
        path="/preregister/:registration_name"
        component={Preregistration}
      />
      <Route path="/unregister/:registration_name" component={Unregister} />
      <Route path="/delete/:registration_name" component={DeleteEvent} />
    </Switch>
  );
}

export default Pages;
