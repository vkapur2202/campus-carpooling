import gql from "graphql-tag";

export const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      year
      gender
      can_drive
      max_capacity
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
      gender
      can_drive
      max_capacity
    }
  }
`;

export const GET_ALL_EVENTS_QUERY = gql`
  query {
    activeEvents {
      user {
        id
        name
      }
      id
      name
      max_participants
      start_location
      end_location
      event_date
    }
    inactiveEvents {
      user {
        id
        name
      }
      id
      name
      max_participants
      start_location
      end_location
      event_date
    }
  }
`;

export const GET_ALL_USER_EVENTS_QUERY = gql`
  query($id: ID!) {
    user(id: $id) {
      active_events {
        user {
          id
          name
        }
        id
        name
        max_participants
        start_location
        end_location
        event_date
      }
      inactive_events {
        user {
          id
          name
        }
        id
        name
        max_participants
        start_location
        end_location
        event_date
      }
    }
  }
`;

export const GET_EVENT_QUERY = gql`
  query($id: ID!) {
    event(id: $id) {
      name
      max_participants
      start_location
      end_location
      event_date
      participants
    }
  }
`;

export const CREATE_EVENT_MUTATION = gql`
  mutation(
    $name: String!
    $max_participants: Int!
    $start_location: String!
    $end_location: String!
    $event_date: DateTime!
  ) {
    createEvent(
      name: $name
      max_participants: $max_participants
      start_location: $start_location
      end_location: $end_location
      event_date: $event_date
    ) {
      user {
        id
        name
      }
      name
      max_participants
      start_location
      end_location
      event_date
      participants
    }
  }
`;

export const UPDATE_EVENT_MUTATION = gql`
  mutation(
    $id: Int!
    $name: String!
    $max_participants: Int!
    $start_location: String!
    $end_location: String!
    $event_date: DateTime!
  ) {
    updateEvent(
      id: $id
      name: $name
      max_participants: $max_participants
      start_location: $start_location
      end_location: $end_location
      event_date: $event_date
    ) {
      message
    }
  }
`;

export const DELETE_EVENT_MUTATION = gql`
  mutation($event_id: Int!) {
    deleteEvent(event_id: $event_id) {
      message
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

export const REGISTER_MUTATION = gql`
  mutation($event_id: Int!) {
    register(event_id: $event_id) {
      event {
        name
        start_location
        end_location
        event_date
      }
    }
  }
`;

export const UNREGISTER_MUTATION = gql`
  mutation($event_id: Int!) {
    unregister(event_id: $event_id) {
      message
    }
  }
`;

export const GET_ALL_USER_REGISTRATIONS_QUERY = gql`
  query($id: ID!) {
    user(id: $id) {
      registrations {
        event {
          id
          name
          max_participants
          start_location
          end_location
          event_date
          is_active
          updated_on
          user {
            name
            email
          }
        }
      }
    }
  }
`;

// export const GET_ALL_EVENT_REGISTRATIONS_QUERY = gql`
//   query($id: ID!) {
//     event(id: $id) {
//       registrations {
//         user_id
//       }
//     }
//   }
// `;

// export const NUMBER_OF_PARTICIPANTS_MUTATION = gql`
//   mutation($event_id: Int!) {

//   }
//   `;
