import React from "react";
import ReactDOM from "react-dom";
import CreateEventForm from './CreateEventForm';
import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { CREATE_EVENT_MUTATION } from "../../GraphQLRequests";

const mocks = [
    {
        request:{
            query: CREATE_EVENT_MUTATION,
        },
        result:{
            data:{
                createEvent: {message: "Error Message" }
            },
        },
    }
]


it("renders the correct content", () => {
    render(
        //<MockedProvider mocks={mocks} addTypename={false}>
        //    <CreateEventForm/>
        //</MockedProvider>
    );
});

