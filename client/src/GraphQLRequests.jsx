import gql from "graphql-tag";

export const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      confirmed
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation {
    logout {
      message
    }
  }
`;

export const ACTIVATE_ACCOUNT_MUTATION = gql`
  mutation {
    activateAccount {
      message
    }
  }
`;

export const CONFIRM_ACCOUNT_MUTATION = gql`
  mutation($token: String!) {
    confirmAccount(token: $token) {
      id
      name
      email
      confirmed
    }
  }
`;

export const PROFILE_MUTATION = gql`
  mutation(
    $year: String!
    $gender: String!
    $can_drive: Boolean!
    $max_capacity: Int!
  ) {
    setProfile(
      year: $year
      gender: $gender
      can_drive: $can_drive
      max_capacity: $max_capacity
    ) {
      id
      name
      year
    }
  }
`;

export const RESET_REQUEST_MUTATION = gql`
  mutation($email: String!) {
    resetRequest(email: $email) {
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      id
      name
      email
    }
  }
`;
