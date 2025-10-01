/**
 * GraphQL Resolvers
 * 
 * Implements the business logic for all GraphQL queries and mutations.
 * Handles data persistence to/from sampleData.json file.
 * 
 * Features:
 * - File-based persistence (sampleData.json)
 * - Input validation for mutations
 * - User authentication (login/register)
 * - User-specific booking filtering
 * - Simulated network delay for realistic UX
 * 
 * @module resolvers
 */

import sampleData from '../data/sampleData.json';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Simulates network delay for realistic API behavior
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Reads current data from the JSON file
 * 
 * @returns {any} Parsed JSON data containing salons, services, staff, schedules, users, and bookings
 */
const readData = () => {
  const filePath = path.join(__dirname, '../data/sampleData.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

/**
 * Writes data to the JSON file
 * Formats JSON with 2-space indentation for readability
 * 
 * @param {any} data - Data object to write to file
 */
const writeData = (data: any) => {
  const filePath = path.join(__dirname, '../data/sampleData.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const resolvers = {
  Query: {
    // Get all salons
    getSalons: async () => {
      console.log('GraphQL Query: getSalons');
      await delay(300);
      return sampleData.salons;
    },

    // Get services for a specific salon
    getServices: async (_: any, { salonId }: { salonId: string }) => {
      console.log('GraphQL Query: getServices', { salonId });
      await delay(300);
      return sampleData.services.filter(service => service.salonId === salonId);
    },

    // Get staff for a specific salon
    getStaff: async (_: any, { salonId }: { salonId: string }) => {
      console.log('GraphQL Query: getStaff', { salonId });
      await delay(300);
      return sampleData.staff.filter(staff => staff.salonId === salonId);
    },

    // Get schedules for a specific staff member
    getStaffSchedules: async (_: any, { staffId }: { staffId: string }) => {
      console.log('GraphQL Query: getStaffSchedules', { staffId });
      await delay(300);
      // In a real app, this would be filtered by staffId
      return sampleData.schedules;
    },

    // Get bookings for a specific user
    getBookings: async (_: any, { userId }: { userId: string }) => {
      console.log('GraphQL Query: getBookings for user:', userId);
      await delay(300);
      const data = readData();
      const userBookings = (data.bookings || []).filter((b: any) => b.userId === userId);
      return userBookings;
    },
  },

  Mutation: {
    // Create a new booking
    createBooking: async (_: any, { input }: { input: any }) => {
      console.log('GraphQL Mutation: createBooking', input);
      await delay(500);

      const { userId, salonId, serviceIds, staffId, time } = input;

      // Read current data
      const data = readData();

      // Find related data
      const salon = data.salons.find((s: any) => s.id === salonId);
      const services = data.services.filter((s: any) => serviceIds.includes(s.id));
      const staff = data.staff.find((s: any) => s.id === staffId);

      if (!salon || !staff || services.length === 0) {
        throw new Error('Invalid booking data');
      }

      // Create booking
      const booking = {
        id: `booking-${Date.now()}`,
        userId,
        salon,
        services,
        staff,
        time,
      };

      // Initialize bookings array if it doesn't exist
      if (!data.bookings) {
        data.bookings = [];
      }

      // Add booking to data
      data.bookings.push(booking);

      // Write back to file
      writeData(data);

      console.log('Booking created:', booking.id, 'for user:', userId);
      return booking;
    },

    // Register a new user
    register: async (_: any, { input }: { input: any }) => {
      console.log('GraphQL Mutation: register', { email: input.email });
      await delay(300);

      const { name, phone, email, password } = input;

      // Read current data
      const data = readData();

      // Check if user already exists
      const existingUser = data.users.find((u: any) => u.email === email);
      if (existingUser) {
        console.log('Registration failed: Email already exists');
        return {
          success: false,
          message: 'Email already registered. Please login instead.',
          user: null,
        };
      }

      // Validate input
      if (!name || !phone || !email || !password) {
        return {
          success: false,
          message: 'All fields are required',
          user: null,
        };
      }

      if (phone.length < 10) {
        return {
          success: false,
          message: 'Phone number must be at least 10 digits',
          user: null,
        };
      }

      if (!email.includes('@')) {
        return {
          success: false,
          message: 'Invalid email address',
          user: null,
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters',
          user: null,
        };
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        phone,
        email,
        password, // Note: In production, you'd hash this!
      };

      // Add user to data
      data.users.push(newUser);

      // Write back to file
      writeData(data);

      console.log('User registered:', newUser.email);

      // Return user without password
      const userWithoutPassword = {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
      };
      return {
        success: true,
        message: 'Registration successful! Please login to continue.',
        user: userWithoutPassword,
      };
    },

    // Login a user
    login: async (_: any, { input }: { input: any }) => {
      console.log('GraphQL Mutation: login', { email: input.email });
      await delay(300);

      const { email, password } = input;

      // Read current data
      const data = readData();

      // Find user
      const user = data.users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        console.log('Login failed: Invalid credentials');
        return {
          success: false,
          message: 'Invalid email or password',
          user: null,
        };
      }

      console.log('Login successful:', user.email);

      // Return user without password
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      };
      return {
        success: true,
        message: 'Login successful!',
        user: userWithoutPassword,
      };
    },
  },
};
