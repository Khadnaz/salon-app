# MSW (Mock Service Worker) Setup

This folder contains the MSW configuration for mocking the GraphQL API.

## 📁 File Structure

```
mocks/
├── handlers.ts      # GraphQL query/mutation handlers
├── browser.ts       # MSW setup for web browsers
├── server.ts        # MSW setup for Node.js (tests)
├── native.ts        # React Native mock resolver
└── README.md        # This file
```

## 🎯 What is MSW?

**Mock Service Worker (MSW)** is a powerful API mocking library that intercepts network requests at the **network level**. It works by:

1. Installing a Service Worker (in browsers)
2. Intercepting fetch/XHR requests
3. Returning mock responses based on handlers

## 🚀 How It Works

### For Web (Browser):
```tsx
import { worker } from './mocks/browser';

// Start MSW
worker.start();

// Now all GraphQL requests are intercepted!
```

### For React Native:
```tsx
import { mockGraphQLResolver } from './mocks/native';

// Use mock resolver directly
const salons = await mockGraphQLResolver.getSalons();
```

## ⚠️ **Important: React Native Limitations**

**MSW does NOT work natively on React Native mobile apps!**

### Why?
- MSW relies on **Service Workers** (browser API)
- React Native doesn't have Service Workers
- Mobile apps don't support service worker registration

### Solutions:

#### Option 1: Use the Mock Service (Current)
✅ **Recommended for React Native**
```tsx
import { mockGraphQL } from '../services/mockGraphQLService';
```

#### Option 2: MSW for Web Only
If running Expo web (`npx expo start --web`):
```tsx
import { worker } from './mocks/browser';
worker.start();
```

#### Option 3: Native Resolver Pattern
```tsx
import { mockGraphQLResolver } from './mocks/native';
```

## 📊 Comparison

| Feature | MSW (Browser) | Mock Service | Native Resolver |
|---------|---------------|--------------|-----------------|
| **Works on Mobile** | ❌ No | ✅ Yes | ✅ Yes |
| **Works on Web** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Network Tab** | ✅ Shows requests | ❌ No requests | ❌ No requests |
| **Realistic** | ✅✅✅ Very | ✅✅ Moderate | ✅✅ Moderate |
| **Setup Complexity** | 🔴 High | 🟢 Low | 🟢 Low |

## 🛠️ Current Implementation

This project uses a **hybrid approach**:

### For React Native (Mobile):
```tsx
// services/mockGraphQLService.ts
export const mockGraphQL = {
  getSalons: async () => { ... },
  createBooking: async (params) => { ... }
};
```

### For Web (If needed):
```tsx
// mocks/browser.ts
import { worker } from 'msw/browser';
worker.start();
```

## 📝 GraphQL Schema Handlers

All handlers are defined in `handlers.ts`:

### Queries:
- `GetSalons` → Returns list of salons
- `GetServices` → Returns services for a salon
- `GetStaff` → Returns staff members
- `GetStaffSchedules` → Returns available time slots

### Mutations:
- `CreateBooking` → Creates a new booking

## 🧪 Testing with MSW

For Jest/Vitest tests:

```tsx
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 🔄 Migrating to Real API

When ready to connect to a real GraphQL API:

1. Remove mock imports
2. Update GraphQL endpoint
3. Use Apollo Client or similar
4. Keep mocks for testing!

```tsx
// Before (Mock):
import { mockGraphQL } from './services/mockGraphQLService';

// After (Real API):
import { useQuery, useMutation } from '@apollo/client';
```

## 📚 Resources

- [MSW Documentation](https://mswjs.io/)
- [MSW with React Native](https://github.com/mswjs/msw/discussions/1644)
- [GraphQL with MSW](https://mswjs.io/docs/api/graphql)

## 💡 Best Practices

1. ✅ Use MSW for **web development** and **testing**
2. ✅ Use **mock service** for **React Native mobile**
3. ✅ Keep mock data in **separate JSON files**
4. ✅ Log intercepted requests for **debugging**
5. ✅ Match **real API structure** as closely as possible

## 🎯 When to Use What

| Scenario | Use This |
|----------|----------|
| Developing mobile app | `mockGraphQLService.ts` |
| Developing web version | `mocks/browser.ts` (MSW) |
| Writing tests | `mocks/server.ts` (MSW) |
| Production | Real API (Apollo/Fetch) |
