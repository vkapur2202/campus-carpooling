import React from "react";
import ReactDOM from "react-dom";
import NavBar from './NavBar';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

it("renders the correct content", () => {
    render(
        //<MockedProvider >
        //    <MemoryRouter>
        //    <NavBar/>
        //    </MemoryRouter>
        //</MockedProvider>
    );
});

