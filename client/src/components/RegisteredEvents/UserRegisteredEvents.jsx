import React from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Unregister from "../Unregister/Unregister";
import Moment from "react-moment";

function Registrations(props) {
  const [unregisterShow, setUnregisterShow] = useState(false);
  const [registration, setRegistration] = useState();
  const [event, setEvent] = useState();
  return (
    <>
      <div className="inactiveEvents">
        <h2> Your Registered Events</h2>
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
                    }}
                  >
                    Unregister
                  </Button>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>

      <Modal show={unregisterShow} onHide={() => setUnregisterShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unregister</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Unregister registration={registration} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setUnregisterShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Registrations;
