import React from "react";
import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "../../GraphQLRequests";

const User = (props) => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {(payload) => props.children(payload)}
  </Query>
);

export default User;
