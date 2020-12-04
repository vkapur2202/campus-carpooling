import React from "react";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState, useContext } from "react";
import Registration from "../Registration/Registration";
import Moment from "react-moment";
import { GET_ALL_EVENT_REGISTRATIONS_QUERY } from "../../GraphQLRequests";
import { useQuery } from "@apollo/react-hooks";
import { Context } from "../Store/Store";
import { useEffect } from "react";
import { Link } from "react-router-dom";

// const EventDetails = () => {
//   const { loading, error, data } = (id) => {
//     useQuery(GET_ALL_EVENT_REGISTRATIONS_QUERY, {
//       variables: props.event.id,
//     });
//     if (data) {
//       console.log(data);
//     }
//     if (loading) return null;
//     if (error) return `Error! ${error}`;
//     if (data) {
//       console.log(data);
//     }
//   };
// };

function Events(props) {
  let storage = window.localStorage;
  const [show, setShow] = useState(false);
  const [event, setEvent] = useState();
  const [state, dispatch] = useContext(Context);
  // console.log(state);
  // console.log(props);
  // const [events, {loading, data}] = useLazyQuery(GET_ALL_EVENT_REGISTRATIONS_QUERY);

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
              <th>Register</th>
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
                      pathname: `/register/${event.name}`,
                      // state: { event: JSON.stringify(event) },
                    }}
                  >
                    <Button
                      style={{
                        padding: 0,
                        fontWeight: "bold",
                        color: "green",
                      }}
                      variant="link"
                      onClick={() => {
                        setShow(true);
                        setEvent(event);
                        storage.setItem('event', JSON.stringify(event));
                      }}
                    >
                      Register
                    </Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      </div>

      {/* <Modal show={show} onHide={() => setShow(false)}>
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
      </Modal> */}
    </>
  );
}

export default Events;
