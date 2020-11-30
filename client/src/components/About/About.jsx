import React from "react";
import config from "../../config/config";
import AboutCSS from "./About.css";

class About extends React.Component {
  render() {
    return (
      <div>
        <div className="content">
          <div className="vertical-content6">
            <h1>About CampusLive</h1>
            <div className="beautiful">
              <p>
                Until now, college students have relied on texting individual
                friends or groupchats to plan their events. However, this form
                of event planning has consistenly proved to be inefficient and
                stress-inducing; from calculating availability to organzing
                transportation, keeping track of each individuals' needs can be
                a hassle. <br /> <br />
                We, here at CampusLive, knew there had to be a better way.{" "}
                <br />
                <br />
                We envisioned an application that would revolve around the
                user's schedule. College students already have enough on their
                plate -social gatherings should relieve stress, not cause any!
                Let us take care of the event scheduling, college students can
                just focus on the fun! <br /> <br />
                CampusLive can make mundane activities more social by allowing
                students to interact through the app by either creating or
                registering for carpooling events. <br /> <br />
                To start using CampusLive first create an account on the Sign up
                page. Then once you have logged in you can browse and register
                for events posted by other users. Once you register for an event
                this event will show up in the Your Registrations page where you
                can also unregister for events. Additionally on the Your Events
                page you can create a new event by filling out the information
                for your trip. Once you've created an event, other users will
                have the option of signing up for the event. <br /> <br /> Now that you know
                how to use the app we hope you'll check out the available events
                and set up your own to meet new people and make new friends
                during your travels! <br /> <br />
                Disclaimer: CampusLive does not endorse social gatherings in the
                current pandemic.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
