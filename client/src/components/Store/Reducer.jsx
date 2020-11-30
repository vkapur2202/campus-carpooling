const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOGIN_STATUS":
      return {
        ...state,
        loggedIn: action.payload,
      };
    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload,
      };
    // case "SET_CURRENT_USER_INFORMATION":
    //   return {
    //     ...state,
    //     currentUserYear: action.payload.year,
    //     currentUserGender: action.payload.gender,
    //     currentUserDrive: action.payload.can_drive,
    //     currentUserMaxCap: action.payload.max_capacity,
    //   }
    default:
      return state;
  }
};

export default Reducer;
