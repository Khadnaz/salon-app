/**
 * GraphQL Service Layer
 * 
 * This service acts as an intermediary between the React Native frontend
 * and the Apollo Server GraphQL backend. It provides type-safe functions
 * for all GraphQL queries and mutations.
 * 
 * Architecture:
 * - Frontend calls these functions
 * - Service makes fetch requests to Apollo Server at http://localhost:4000/graphql
 * - Apollo Server processes queries/mutations
 * - Data is persisted to data/sampleData.json
 * 
 * @module mockGraphQLService
 */

import sampleData from '../data/sampleData.json';

// ==================== TYPE DEFINITIONS ====================

/**
 * Represents a salon/spa business location
 */
export type Salon = {
  id: string;
  name: string;
  address: string;
  rating: number;
};

/**
 * Represents a service offered at a salon
 */
export type Service = {
  id: string;
  name: string;
  price: number;
  salonId: string; // Foreign key to Salon
};

/**
 * Represents a staff member at a salon
 */
export type Staff = {
  id: string;
  name: string;
  specialization: string;
  photo: string; // URL to staff photo
  salonId: string; // Foreign key to Salon
};

/**
 * Represents an available time slot
 */
export type Schedule = {
  id: string;
  time: string; // e.g., "10:00 AM"
  isAvailable: boolean;
};

/**
 * Represents a confirmed booking
 */
export type Booking = {
  id: string;
  salon: Salon;
  services: Service[];
  staff: Staff;
  time: string;
};

/**
 * Represents a user account
 */
export type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

/**
 * Response type for authentication operations
 */
export type AuthResponse = {
  success: boolean;
  message: string;
  user?: User; // User data (without password) if successful
};

// ==================== CONFIGURATION ====================

/**
 * Apollo Server GraphQL endpoint URL
 * Change this if your server runs on a different port
 */
const APOLLO_SERVER_URL = 'http://localhost:4000/graphql';

// ==================== GRAPHQL OPERATIONS ====================

/**
 * Collection of GraphQL queries and mutations
 * All operations communicate with Apollo Server via fetch API
 */
export const mockGraphQL = {
  /**
   * Query: Get All Salons
   * 
   * Fetches a list of all available salons
   * @returns {Promise<Salon[]>} Array of salon objects
   * @async
   */
  getSalons: async (): Promise<Salon[]> => {
    const response = await fetch(APOLLO_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { getSalons { id name address rating } }`
      })
    });
    const result = await response.json();
    return result.data.getSalons;
  },

  /**
   * Query: Get Services for a Salon
   * 
   * Fetches all services offered at a specific salon
   * @param {string} salonId - The ID of the salon
   * @returns {Promise<Service[]>} Array of service objects for the salon
   * @async
   */
  getServices: async (salonId: string): Promise<Service[]> => {
    const response = await fetch(APOLLO_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetServices($salonId: ID!) { getServices(salonId: $salonId) { id name price salonId } }`,
        variables: { salonId }
      })
    });
    const result = await response.json();
    return result.data.getServices;
  },

  /**
   * Query: Get Staff for a Salon
   * 
   * Fetches all staff members working at a specific salon
   * @param {string} salonId - The ID of the salon
   * @returns {Promise<Staff[]>} Array of staff objects for the salon
   * @async
   */
  getStaff: async (salonId: string): Promise<Staff[]> => {
    const response = await fetch(APOLLO_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetStaff($salonId: ID!) { getStaff(salonId: $salonId) { id name specialization photo salonId } }`,
        variables: { salonId }
      })
    });
    const result = await response.json();
    return result.data.getStaff;
  },

  /**
   * Query: Get Staff Member's Schedule
   * 
   * Fetches available time slots for a specific staff member
   * @param {string} staffId - The ID of the staff member
   * @returns {Promise<Schedule[]>} Array of schedule objects with availability
   * @async
   */
  getStaffSchedules: async (staffId: string): Promise<Schedule[]> => {
    const response = await fetch(APOLLO_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetSchedules($staffId: ID!) { getStaffSchedules(staffId: $staffId) { id time isAvailable } }`,
        variables: { staffId }
      })
    });
    const result = await response.json();
    return result.data.getStaffSchedules;
  },

  /**
   * Query: Get User's Bookings
   * 
   * Fetches all bookings for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Booking[]>} Array of booking objects for the user
   * @async
   */
  getBookings: async (userId: string): Promise<Booking[]> => {
    const response = await fetch(APOLLO_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetBookings($userId: ID!) { getBookings(userId: $userId) { id userId salon { id name } services { id name price } staff { id name } time } }`,
        variables: { userId }
      })
    });
    const result = await response.json();
    return result.data.getBookings;
  },

  /**
   * Mutation: Create a New Booking
   * 
   * Creates a new booking and persists it to the backend
   * @param {object} params - Booking parameters
   * @param {string} params.userId - The ID of the user making the booking
   * @param {string} params.salonId - The ID of the selected salon
   * @param {string[]} params.serviceIds - Array of selected service IDs
   * @param {string} params.staffId - The ID of the selected staff member
   * @param {string} params.time - The selected time slot
   * @returns {Promise<Booking>} The created booking object
   * @async
   */
  createBooking: async (params: {
    userId: string;
    salonId: string;
    serviceIds: string[];
    staffId: string;
    time: string;
  }): Promise<Booking> => {
    const response = await fetch(APOLLO_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreateBooking($input: BookingInput!) {
            createBooking(input: $input) {
              id
              userId
              salon { id name address rating }
              services { id name price }
              staff { id name specialization photo }
              time
            }
          }
        `,
        variables: { input: params }
      })
    });
    const result = await response.json();
    return result.data.createBooking;
  },

  /**
   * Mutation: Register a New User
   * 
   * Creates a new user account with validation
   * Backend validates:
   * - Email uniqueness
   * - Password length (min 6 characters)
   * - Phone number format (min 10 digits)
   * 
   * @param {object} params - Registration parameters
   * @param {string} params.name - User's full name
   * @param {string} params.phone - User's phone number
   * @param {string} params.email - User's email address
   * @param {string} params.password - User's password
   * @returns {Promise<AuthResponse>} Authentication response with user data
   * @async
   */
  register: async (params: {
    name: string;
    phone: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(APOLLO_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              success
              message
              user {
                id
                name
                phone
                email
              }
            }
          }
        `,
        variables: { input: params }
      })
    });

    const result = await response.json();
    return result.data.register;
  },

  /**
   * Mutation: User Login
   * 
   * Authenticates a user with email and password
   * Returns user data (without password) on success
   * 
   * @param {object} params - Login credentials
   * @param {string} params.email - User's email address
   * @param {string} params.password - User's password
   * @returns {Promise<AuthResponse>} Authentication response with user data
   * @async
   */
  login: async (params: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(APOLLO_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Login($input: LoginInput!) {
            login(input: $input) {
              success
              message
              user {
                id
                name
                phone
                email
              }
            }
          }
        `,
        variables: { input: params }
      })
    });

    const result = await response.json();
    return result.data.login;
  },
};
