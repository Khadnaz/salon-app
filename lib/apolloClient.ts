/**
 * Apollo Client Configuration
 * Sets up the GraphQL client for the application
 */

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// GraphQL server endpoint
const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

// Create HTTP link
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

console.log('✅ Apollo Client configured');
console.log(`🌐 GraphQL Endpoint: ${GRAPHQL_ENDPOINT}`);
