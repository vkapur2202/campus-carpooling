import React from "react";
import ReactDOM from "react-dom";
import ResetRequestForm from './ResetRequestForm';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { RESET_REQUEST_MUTATION } from "../../GraphQLRequests";
import { MemoryRouter } from 'react-router-dom';

it("renders the correct content", () => {
    const value = {
        message : "Test Message"
    };

    const mocks = [
        {
            request:{
                query: RESET_REQUEST_MUTATION,
                variables: {
                    email:"smd148@case.edu"
                },
            },
            result:{
                data:{
                    message: {value}
                },
            },
            }
    ]
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
            <ResetRequestForm/>
            </MemoryRouter>
        </MockedProvider>
    );
});

