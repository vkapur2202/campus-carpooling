import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";

// Instantiate required constructor fields
const cache = new InMemoryCache();
const link = createHttpLink({
  uri: "http://localhost:4000/",
  credentials: "include",
});

export const useAppApolloClient = () => {
  return new ApolloClient({
    link,
    cache,
  });
};
