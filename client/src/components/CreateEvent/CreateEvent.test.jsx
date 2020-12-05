import React from "react";
import ReactDOM from "react-dom";
import CreateEvent from './CreateEvent';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

it("renders the correct content", () => {
    render(
        <MockedProvider >
            <MemoryRouter>
            <CreateEvent/>
            </MemoryRouter>
        </MockedProvider>
    );
});

