import React from "react";
import ReactDOM from "react-dom";
import Login from './Login';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

it("renders the correct content", () => {
    render(
        //<MockedProvider >
        //    <MemoryRouter>
        //    <Login/>
        //    </MemoryRouter>
        //</MockedProvider>
    );
});

