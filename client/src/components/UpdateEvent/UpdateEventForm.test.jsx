import React from "react";
import ReactDOM from "react-dom";
import UpdateEventForm from './UpdateEventForm';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { UPDATE_EVENT_MUTATION } from "../../GraphQLRequests";

it("renders the correct content", () => {
    const testEvent = {
        name: 'Test Event',
        max_participants: 4,
        start_location: 'Test Start',
        end_location: 'Test End',
        event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    }

    const Value = {
        id: 2,
        name: 'Test Event',
        max_participants: 4,
        start_location: 'Test Start',
        end_location: 'Test End',
        event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    };

    const mocks = [
        {
            request:{
                query: UPDATE_EVENT_MUTATION,
                variables: {
                    id: 2,
                    name: 'Test Event',
                    max_participants: 4,
                    start_location: 'Test Start',
                    end_location: 'Test End',
                    event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
                },
            },
            result:{
                data:{
                    updateEvent: {Value}
                },
            },
            }
    ]

    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
            <UpdateEventForm event={testEvent}/>
            </MemoryRouter>
        </MockedProvider>
    );
});