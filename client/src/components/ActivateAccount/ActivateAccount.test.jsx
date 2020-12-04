import React from "react";
import ReactDOM from "react-dom";
import ActivateAccount from './ActivateAccount';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { ACTIVATE_ACCOUNT_MUTATION } from "../../GraphQLRequests";

it("renders the correct content", () => {
    const activateAccountValue = {message : "Test Message"};

    const activateAccountMock = [
        {
        request:{
            query: ACTIVATE_ACCOUNT_MUTATION,
            variables: {},
        },
        result:{
            data:{
                activateAccount: {activateAccountValue}
            },
        },
        }
    ]

    render(
        //<MockedProvider mocks={activateAccountMock} addTypename={false}>
        //    <ActivateAccount/>
        //</MockedProvider>
    )
});