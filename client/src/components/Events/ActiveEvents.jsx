import React from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import Registration from "../Registration/Registration";
import Moment from 'react-moment';

function Events(props) {
  const [show, setShow] = useState(false);
  const [event, setEvent] = useState();
  return (
    <>
      <div className="activeEvents">
        <h2>Active Events</h2>
        <Table hover>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Max Participants</th>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Date and Time</th>
              <th>Event Host</th>
            </tr>
          </thead>

          {props.events.map((event, i) => (
            <tbody key={i}>
              <tr>
                <td>{event.name}</td>
                <td>{event.max_participants}</td>
                <td>{event.start_location}</td>
                <td>{event.end_location}</td>
                <td>
                  <Moment format="LLL">
                    {event.event_date}
                  </Moment> 
                </td>
                <td>{event.user.name}</td>
                <td>
                  <Button
                    style={{
                      padding: 0,
                      fontWeight: "bold",
                      color: "green",
                    }}
                    variant="link"
                    onClick={() => {
                      setShow(true)
                      setEvent(event)
                    }
                    }
                  >
                    Register
                  </Button>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Registration event={event} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Events;
