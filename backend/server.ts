/**
 * Apollo Server Setup
 * Creates a GraphQL server for the salon booking system
 */

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

async function startServer() {
  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log('');
  console.log('============================================');
  console.log('Apollo Server ready!');
  console.log(`GraphQL endpoint: ${url}`);
  console.log(`GraphQL Playground: ${url}`);
  console.log('============================================');
  console.log('');
  console.log('Available Queries:');
  console.log('   - getSalons');
  console.log('   - getServices(salonId: ID!)');
  console.log('   - getStaff(salonId: ID!)');
  console.log('   - getStaffSchedules(staffId: ID!)');
  console.log('   - getBookings(userId: ID!)');
  console.log('');
  console.log('Available Mutations:');
  console.log('   - createBooking(input: BookingInput!)');
  console.log('   - register(input: RegisterInput!)');
  console.log('   - login(input: LoginInput!)');
  console.log('');
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
