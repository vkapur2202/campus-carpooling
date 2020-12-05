import React from "react";
import ReactDOM from "react-dom";
import DeleteEventForm from './DeleteEventForm';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { DELETE_EVENT_MUTATION } from "../../GraphQLRequests";

it("renders the correct content", () => {
    /*
    const testEvent = {
        id: 4,
        name: 'Test Event',
        max_participants: 4,
        start_location: 'Test Start',
        end_location: 'Test End',
        event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    }

    const Value = {
        message : "Test Message"
    };

    const mocks = [
        {
            request:{
                query: DELETE_EVENT_MUTATION,
                variables: {
                    event_id: 4
                },
            },
            result:{
                data:{
                    deleteEvent: {Value}
                },
            },
            }
    ]

    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
            <DeleteEventForm event={testEvent}/>
            </MemoryRouter>
        </MockedProvider>
    );
    */
});