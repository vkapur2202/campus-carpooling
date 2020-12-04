import React from "react";
import ReactDOM from "react-dom";
import ActivateAccount from './ActivateAccount';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { ACTIVATE_ACCOUNT_MUTATION } from "../../GraphQLRequests";


const mocks = [
    {
        request:{
            query: ACTIVATE_ACCOUNT_MUTATION,
        },
        result:{
            data:{
                activateAccount: {message: "Error Message" }
            },
        },
    }
]


it("renders the correct content", () => {
    render(
        //<MockedProvider mocks={mocks} addTypename={false}>
        //    <ActivateAccount/>
        //</MockedProvider>
    );
});

