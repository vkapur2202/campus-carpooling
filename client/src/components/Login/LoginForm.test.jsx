import React from "react";
import ReactDOM from "react-dom";
import LoginForm from './LoginForm';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { LOGIN_MUTATION } from "../../GraphQLRequests";
import { MemoryRouter } from 'react-router-dom';

it("renders the correct content", () => {
    /*
    const login = {
        id: 3,
        name:"Sarah",
        confirmed:true
    };

    const mocks = [
        {
            request:{
                query: LOGIN_MUTATION,
                variables: {
                    email: "smd148@case.edu",
                    password: "pass123"
                },
            },
            result:{
                data:{login},
            },
            }
    ]
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter>
            <LoginForm/>
            </MemoryRouter>
        </MockedProvider>
    );
    */
});

