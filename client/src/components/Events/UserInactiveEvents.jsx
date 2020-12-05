import React from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import UpdateUserEvent from "../UpdateEvent/UpdateEvent";
import DeleteUserEvent from "../DeleteUserEvent/DeleteEvent";
import { useState } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";

function Events(props) {
  let storage = window.localStorage;
  const [updateShow, setUpdateShow] = useState(false);
  const [templateShow, setTemplateShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [event, setEvent] = useState();

  return (
    <>
      <div className="inactiveEvents">
        <h2>Your Inactive Events</h2>
        <Table hover>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Max Participants</th>
              <th>Start Location</th>
              <th>End Location</th>
              <th>Proposed Date and Time</th>
              <th>Event Host</th>
              <th>Update</th>
              <th>Template</th>
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
                <td>
                  <Moment format="LLL">{event.event_date}</Moment>
                </td>
                <td>{event.user.name}</td>
                <td>
                <Link
                    to={{
                      pathname: `/update_event/${event.name}`,
                    }}
                  >
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
                      storage.setItem("event", JSON.stringify(event));
                    }}
                  >
                    Update
                  </Button>
                  </Link>
                </td>
                <td>
                  <Button
                    style={{
                      padding: 0,
                      fontWeight: "bold",
                      color: "green",
                    }}
                    variant="link"
                    onClick={() => setTemplateShow(true)}
                  >
                    Template
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
                    onClick={() => {
                      setDeleteShow(true);
                      setEvent(event);
                      storage.setItem("event", JSON.stringify(event));
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>

      {/* <Modal show={updateShow} onHide={() => setUpdateShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateUserEvent event={event} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setUpdateShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={templateShow} onHide={() => setTemplateShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>Show details here</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setTemplateShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Modal show={deleteShow} onHide={() => setDeleteShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DeleteUserEvent event={event} />
        </Modal.Body>
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
