import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { View, Text } from "react-native";
import { Slot } from "expo-router";

const client = new ApolloClient({
  uri: "http://192.168.1.105:8080/graphql", // Replace with your GraphQL API URL
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Slot /> 
    </ApolloProvider>
  );
}
