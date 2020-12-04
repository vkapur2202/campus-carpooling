import React from "react";
import ReactDOM from "react-dom";
import CreateEventForm from './CreateEventForm';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { CREATE_EVENT_MUTATION } from "../../GraphQLRequests";
import { MemoryRouter } from 'react-router-dom';

it("renders the correct content", () => {
    const value = {
        name: 'Test Event2',
        max_participants: 6,
        start_location: 'Test Start2',
        end_location: 'Test End2',
        event_date: new Date(2020, 9, 26, 18, 30, 0, 0),
    };

    const mocks = [
        {
            request:{
                query: CREATE_EVENT_MUTATION,
                variables: {
                    name: 'Test Event2',
                    max_participants: 6,
                    start_location: 'Test Start2',
                    end_location: 'Test End2',
                    event_date: new Date(2020, 9, 26, 18, 30, 0, 0),
                },
            },
            result:{
                data:{
                    logout: {value}
                },
            },
            }
    ]
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
            <CreateEventForm/>
            </MemoryRouter>
        </MockedProvider>
    );
});

