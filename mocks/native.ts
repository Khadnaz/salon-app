/**
 * MSW-Style Mocking for React Native
 * Since MSW doesn't work natively on React Native, this provides a similar API
 * using the mock service approach
 */

import sampleData from '../data/sampleData.json';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock GraphQL resolver that mimics MSW behavior
export const mockGraphQLResolver = {
  // Queries
  async getSalons() {
    console.log('🔵 Mock Resolver: getSalons');
    await delay(300);
    return sampleData.salons;
  },

  async getServices(salonId: string) {
    console.log('🔵 Mock Resolver: getServices', { salonId });
    await delay(300);
    return sampleData.services.filter(s => s.salonId === salonId);
  },

  async getStaff(salonId: string) {
    console.log('🔵 Mock Resolver: getStaff', { salonId });
    await delay(300);
    return sampleData.staff.filter(s => s.salonId === salonId);
  },

  async getStaffSchedules(staffId: string) {
    console.log('🔵 Mock Resolver: getStaffSchedules', { staffId });
    await delay(300);
    return sampleData.schedules;
  },

  // Mutations
  async createBooking(params: {
    salonId: string;
    serviceIds: string[];
    staffId: string;
    time: string;
  }) {
    console.log('🔵 Mock Resolver: createBooking', params);
    await delay(500);

    const salon = sampleData.salons.find(s => s.id === params.salonId);
    const services = sampleData.services.filter(s => params.serviceIds.includes(s.id));
    const staff = sampleData.staff.find(s => s.id === params.staffId);

    const booking = {
      id: `booking-${Date.now()}`,
      salon,
      services,
      staff,
      time: params.time,
    };

    console.log('✅ Mock Resolver: Booking created', booking);
    return booking;
  },
};

// Export for use in React Native
export const nativeMockServer = {
  start: () => {
    console.log('🎭 Native Mock Server: Started (React Native mode)');
    console.log('📝 Using mockGraphQLResolver for API simulation');
  },
  stop: () => {
    console.log('🎭 Native Mock Server: Stopped');
  },
};
