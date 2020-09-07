import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App/App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "@apollo/react-hooks";
import { useAppApolloClient } from "./config/apolloClient";
import { CookiesProvider } from "react-cookie";
const apolloClient = useAppApolloClient();

const apolloWrappedApp = (
  <ApolloProvider client={apolloClient}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </ApolloProvider>
);

ReactDOM.render(apolloWrappedApp, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
