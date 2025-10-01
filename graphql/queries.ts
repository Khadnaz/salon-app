/**
 * GraphQL Queries and Mutations
 * All GraphQL operations used by the frontend
 */

import { gql } from '@apollo/client';

// Query: Get all salons
export const GET_SALONS = gql`
  query GetSalons {
    getSalons {
      id
      name
      address
      rating
      specialties
    }
  }
`;

// Query: Get services for a salon
export const GET_SERVICES = gql`
  query GetServices($salonId: ID!) {
    getServices(salonId: $salonId) {
      id
      name
      price
      salonId
    }
  }
`;

// Query: Get staff for a salon
export const GET_STAFF = gql`
  query GetStaff($salonId: ID!) {
    getStaff(salonId: $salonId) {
      id
      name
      specialization
      photo
      salonId
    }
  }
`;

// Query: Get schedules for a staff member
export const GET_STAFF_SCHEDULES = gql`
  query GetStaffSchedules($staffId: ID!) {
    getStaffSchedules(staffId: $staffId) {
      id
      time
      isAvailable
    }
  }
`;

// Mutation: Create a booking
export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      salon {
        id
        name
        address
        rating
      }
      services {
        id
        name
        price
      }
      staff {
        id
        name
        specialization
        photo
      }
      time
    }
  }
`;
