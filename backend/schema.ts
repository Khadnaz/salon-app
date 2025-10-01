/**
 * GraphQL Schema Definition
 * 
 * Defines the complete GraphQL API schema for the salon booking system.
 * This includes all types, queries, mutations, and input types.
 * 
 * Structure:
 * - Types: Salon, Service, Staff, Schedule, Booking, User, AuthResponse
 * - Queries: Get operations for salons, services, staff, schedules, and bookings
 * - Mutations: Create bookings, register users, login users
 * - Inputs: BookingInput, RegisterInput, LoginInput
 * 
 * @module schema
 */

export const typeDefs = `#graphql
  # Salon type
  type Salon {
    id: ID!
    name: String!
    address: String!
    rating: Float!
    specialties: [String!]
  }

  # Service type
  type Service {
    id: ID!
    name: String!
    price: Float!
    salonId: ID!
  }

  # Staff type
  type Staff {
    id: ID!
    name: String!
    specialization: String!
    photo: String!
    salonId: ID!
  }

  # Schedule type
  type Schedule {
    id: ID!
    time: String!
    isAvailable: Boolean!
  }

  # Booking type
  type Booking {
    id: ID!
    userId: ID!
    salon: Salon!
    services: [Service!]!
    staff: Staff!
    time: String!
  }

  # User type
  type User {
    id: ID!
    name: String!
    phone: String!
    email: String!
  }

  # Auth response type
  type AuthResponse {
    success: Boolean!
    message: String!
    user: User
  }

  # Input type for creating a booking
  input BookingInput {
    userId: ID!
    salonId: ID!
    serviceIds: [ID!]!
    staffId: ID!
    time: String!
  }

  # Input type for user registration
  input RegisterInput {
    name: String!
    phone: String!
    email: String!
    password: String!
  }

  # Input type for user login
  input LoginInput {
    email: String!
    password: String!
  }

  # Queries
  type Query {
    # Get all salons
    getSalons: [Salon!]!
    
    # Get services for a specific salon
    getServices(salonId: ID!): [Service!]!
    
    # Get staff for a specific salon
    getStaff(salonId: ID!): [Staff!]!
    
    # Get schedules for a specific staff member
    getStaffSchedules(staffId: ID!): [Schedule!]!
    
    # Get bookings for a specific user
    getBookings(userId: ID!): [Booking!]!
  }

  # Mutations
  type Mutation {
    # Create a new booking
    createBooking(input: BookingInput!): Booking!
    
    # Register a new user
    register(input: RegisterInput!): AuthResponse!
    
    # Login a user
    login(input: LoginInput!): AuthResponse!
  }
`;
