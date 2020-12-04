import React from "react";
import ReactDOM from "react-dom";
import UpdateEvent from './UpdateEvent';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

it("renders the correct content", () => {
    const testEvent = {
        name: 'Test Event',
        max_participants: 4,
        start_location: 'Test Start',
        end_location: 'Test End',
        event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    }

    render(
        <MockedProvider >
            <MemoryRouter>
            <UpdateEvent event={testEvent}/>
            </MemoryRouter>
        </MockedProvider>
    );
});