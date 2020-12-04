import React from "react";
import Logout from './Logout';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { LOGOUT_MUTATION } from "../../GraphQLRequests";

const mocks = [
    {
        request:{
            mutation: LOGOUT_MUTATION,
        },
        result:{
            data:{
                logout: {message: "Error Message" }
            },
        },
    }
]

it("renders the correct content", () => {
    render(
        //<MockedProvider mocks={mocks} addTypename={false}>
        //    <Logout/>
        //</MockedProvider>
    );
});

