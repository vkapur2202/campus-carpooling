import React, { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "../../App.css";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import Pages from "../Pages/Pages";
import Store from "../Store/Store";
import { useQuery } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "../../GraphQLRequests";
import { Context } from "../Store/Store";

function App() {
  // const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {});
  // const [state, dispatch] = useContext(Context);

  // if (data) {
  //   dispatch({ type: "SET_CURRENT_USER", payload: data.me });
  // } else {
  //   dispatch({ type: "SET_CURRENT_USER", payload: null });
  // }

  return (
    <div>
      <Router>
        <Store>
          <NavBar />
          <Pages />
          <Footer />
        </Store>
      </Router>
    </div>
  );
}

export default App;
