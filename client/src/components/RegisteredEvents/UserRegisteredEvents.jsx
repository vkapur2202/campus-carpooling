import React from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Unregister from "../Unregister/Unregister";
import Moment from "react-moment";
import { Link } from "react-router-dom";

function Registrations(props) {
  let storage = window.localStorage;
  const [unregisterShow, setUnregisterShow] = useState(false);
  const [registration, setRegistration] = useState();
  const [event, setEvent] = useState();
  return (
    <>
      <div className="inactiveEvents">
        <br />
        <Table hover>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Max Participants</th>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Date and Time</th>
              <th>Updated On</th>
              <th>Event Host</th>
              <th>Host Email</th>
              <th>Unregister</th>
            </tr>
          </thead>

          {props.registrations.map((registration, i) => (
            <tbody key={i}>
              <tr>
                <td>{registration.event.name}</td>
                <td>{registration.event.max_participants}</td>
                <td>{registration.event.start_location}</td>
                <td>{registration.event.end_location}</td>
                <td>
                  <Moment format="LLL">{registration.event.event_date}</Moment>
                </td>
                <td>
                  <Moment format="LLL">{registration.event.updated_on}</Moment>
                </td>
                <td>{registration.event.user.name}</td>
                <td>{registration.event.user.email}</td>
                <td>
                  <Link
                    to={{
                      pathname: `/unregister/${registration.event.name}`,
                    }}
                  >
                    <Button
                      style={{
                        padding: 0,
                        fontWeight: "bold",
                        color: "red",
                      }}
                      variant="link"
                      onClick={() => {
                        setUnregisterShow(true);
                        setRegistration(registration);
                        storage.setItem(
                          "event",
                          JSON.stringify(registration.event)
                        );
                      }}
                    >
                      Unregister
                    </Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>
    </>
  );
}

export default Registrations;
