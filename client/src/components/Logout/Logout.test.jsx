import React from "react";
import Logout from './Logout';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { LOGOUT_MUTATION } from "../../GraphQLRequests";

it("renders the correct content", () => {
    const logoutValue = {message : "Test Message"};

    const logoutMock = [
        {
        request:{
            query: LOGOUT_MUTATION,
            variables: {},
        },
        result:{
            data:{
                logout: {logoutValue}
            },
        },
        }
    ]

    render(
        <MockedProvider mocks={logoutMock} addTypename={false}>
            <Logout/>
        </MockedProvider>
    )
});

