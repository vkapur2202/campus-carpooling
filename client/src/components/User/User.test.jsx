import React from "react";
import ReactDOM from "react-dom";
import User from './User';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { CURRENT_USER_QUERY } from "../../GraphQLRequests";


const mocks = [
    {
        request:{
            query: CURRENT_USER_QUERY,
        },
        result:{
            data:{
                me: {id: '123', email: 'smd148@case.edu', name: 'Sarah Dovgin' }
            },
        },
    }
]


it("renders the correct content", () => {
    render(
        //<MockedProvider mocks={mocks} addTypename={false}>
        //    <User/>
        //</MockedProvider>
    );
});

