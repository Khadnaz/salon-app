/**
 * MSW (Mock Service Worker) Handlers
 * Intercepts GraphQL API requests and returns mock data
 */

import { graphql, HttpResponse } from 'msw';
import sampleData from '../data/sampleData.json';

// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'https://api.salon.com/graphql';

export const handlers = [
  // Query: getSalons
  graphql.query('GetSalons', () => {
    console.log('🔵 MSW: Intercepting GetSalons query');
    return HttpResponse.json({
      data: {
        getSalons: sampleData.salons,
      },
    });
  }),

  // Query: getServices
  graphql.query('GetServices', ({ variables }) => {
    console.log('🔵 MSW: Intercepting GetServices query', variables);
    const { salonId } = variables as { salonId: string };
    const filteredServices = sampleData.services.filter(s => s.salonId === salonId);
    return HttpResponse.json({
      data: {
        getServices: filteredServices,
      },
    });
  }),

  // Query: getStaff
  graphql.query('GetStaff', ({ variables }) => {
    console.log('🔵 MSW: Intercepting GetStaff query', variables);
    const { salonId } = variables as { salonId: string };
    const filteredStaff = sampleData.staff.filter(s => s.salonId === salonId);
    return HttpResponse.json({
      data: {
        getStaff: filteredStaff,
      },
    });
  }),

  // Query: getStaffSchedules
  graphql.query('GetStaffSchedules', ({ variables }) => {
    console.log('🔵 MSW: Intercepting GetStaffSchedules query', variables);
    return HttpResponse.json({
      data: {
        getStaffSchedules: sampleData.schedules,
      },
    });
  }),

  // Mutation: createBooking
  graphql.mutation('CreateBooking', ({ variables }) => {
    console.log('🔵 MSW: Intercepting CreateBooking mutation', variables);
    
    const { salonId, serviceIds, staffId, time } = variables as {
      salonId: string;
      serviceIds: string[];
      staffId: string;
      time: string;
    };

    const salon = sampleData.salons.find(s => s.id === salonId);
    const services = sampleData.services.filter(s => serviceIds.includes(s.id));
    const staff = sampleData.staff.find(s => s.id === staffId);

    const booking = {
      id: `booking-${Date.now()}`,
      salon,
      services,
      staff,
      time,
    };

    console.log('✅ MSW: Booking created', booking);

    return HttpResponse.json({
      data: {
        createBooking: booking,
      },
    });
  }),
];
