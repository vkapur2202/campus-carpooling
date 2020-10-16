import React from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import UpdateUserEvent from "../UpdateEvent/UpdateEvent"
import { useState } from "react";

function Events(props) {
  const [updateShow, setUpdateShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [event, setEvent] = useState();
  return (
    <>
      <div className="inactiveEvents">
        <h2>Your Active Events</h2>
        <Table hover>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Max Participants</th>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Date and Time</th>
              <th>Event Host</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>

          {props.events.map((event, i) => (
            <tbody key={i}>
              <tr>
                <td>{event.name}</td>
                <td>{event.max_participants}</td>
                <td>{event.start_location}</td>
                <td>{event.end_location}</td>
                <td>{event.event_date}</td>
                <td>{event.user.name}</td>
                <td>
                  <Button
                    style={{
                      padding: 0,
                      fontWeight: "bold",
                      color: "blue",
                    }}
                    variant="link"
                    onClick={() => {
                      setUpdateShow(true);
                      setEvent(event);
                      }
                    }
                  >
                    Update
                  </Button>
                </td>
                <td>
                  <Button
                    style={{
                      padding: 0,
                      fontWeight: "bold",
                      color: "red",
                    }}
                    variant="link"
                    onClick={() => setDeleteShow(true)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>

      <Modal show={updateShow} onHide={() => setUpdateShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateUserEvent event={event}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setUpdateShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={deleteShow} onHide={() => setDeleteShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Show details here</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setDeleteShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Events;
