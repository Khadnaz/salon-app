# Code Documentation

Complete technical documentation for the Salon Booking Application.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Backend Architecture](#backend-architecture)
- [Styling System](#styling-system)
- [Authentication Flow](#authentication-flow)
- [Booking Flow](#booking-flow)
- [Key Functions](#key-functions)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Frontend                     │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │  booking.  │  │ Components │  │  mockGraphQLService │   │
│  │   tsx      │──│ (AppBar,   │──│                     │   │
│  │            │  │ BottomNav) │  │  (Service Layer)    │   │
│  └────────────┘  └────────────┘  └──────────┬──────────┘   │
└────────────────────────────────────────────┼────────────────┘
                                              │ HTTP (GraphQL)
                            ┌─────────────────▼────────────────┐
                            │     Apollo Server (Port 4000)     │
                            │  ┌──────────┐  ┌──────────────┐  │
                            │  │  Schema  │  │  Resolvers   │  │
                            │  └────┬─────┘  └──────┬───────┘  │
                            └───────┼────────────────┼──────────┘
                                    │                │
                            ┌───────▼────────────────▼──────────┐
                            │   data/sampleData.json (DB)       │
                            │  - Salons, Services, Staff        │
                            │  - Schedules, Users, Bookings     │
                            └───────────────────────────────────┘
```

### Technology Stack

- **Frontend**: React Native with TypeScript
- **State Management**: React Hooks (useState, useEffect)
- **Backend**: Apollo Server (GraphQL)
- **Data Persistence**: JSON file (sampleData.json)
- **Navigation**: Custom tab-based navigation
- **Styling**: React Native StyleSheet with centralized theme

---

## Project Structure

```
salon_bolt/
├── app/
│   ├── booking.tsx              # Main application component
│   ├── index.tsx                # Entry point (redirects to booking)
│   └── _layout.tsx              # Root layout configuration
│
├── components/
│   ├── AppBar.tsx               # Reusable header component
│   └── BottomNav.tsx            # Reusable navigation bar
│
├── styles/
│   ├── theme.ts                 # Design tokens (colors, spacing, etc.)
│   └── booking.styles.ts        # All application styles
│
├── services/
│   └── mockGraphQLService.ts    # GraphQL service layer
│
├── backend/
│   ├── schema.ts                # GraphQL schema definition
│   ├── resolvers.ts             # GraphQL resolvers (business logic)
│   └── server.ts                # Apollo Server setup
│
├── data/
│   └── sampleData.json          # Persistent data store
│
└── package.json                 # Dependencies and scripts
```

---

## Core Components

### 1. `app/booking.tsx` - Main Application

**Purpose**: The primary component that orchestrates the entire booking flow.

**Key Responsibilities**:
- User authentication (login/signup)
- Multi-step booking workflow management
- Tab-based navigation (Home, Bookings, Profile)
- State management for all user interactions
- Communication with GraphQL backend

**State Categories**:
```typescript
// Authentication
isAuthenticated, currentUser, email, password

// Signup
signupName, signupPhone, signupEmail, signupPassword

// Navigation
activeTab, step, loading

// Data from API
salons, services, staff, schedules

// User Selections
selectedSalon, selectedServices, selectedStaff, selectedSchedule

// Bookings
myBookings
```

**Flow Steps**:
1. `login` → User logs in or signs up
2. `salon` → Select a salon
3. `services` → Choose one or more services
4. `staff` → Select a staff member
5. `schedule` → Pick a time slot
6. `confirmation` → Review booking details
7. `success` → Booking confirmed

---

### 2. `components/AppBar.tsx` - Header Component

**Purpose**: Consistent navigation header across all screens.

**Props**:
- `title: string` - Header text
- `showBackButton?: boolean` - Show/hide back arrow
- `onBackPress?: () => void` - Back button callback
- `rightButton?: React.ReactNode` - Optional right-side action

**Features**:
- Centered title
- Optional back navigation (←)
- Customizable right section
- Shadow and border styling

---

### 3. `components/BottomNav.tsx` - Navigation Bar

**Purpose**: Fixed bottom navigation for tab switching.

**Props**:
- `activeTab: TabType` - Currently active tab
- `onTabChange: (tab: TabType) => void` - Tab change callback

**Tabs**:
- 🏠 **Home** - Main booking flow
- 📅 **Bookings** - User's booking history
- 👤 **Profile** - User account details

**Visual Feedback**:
- Active tab: Orange text (#FF9500), bold, full opacity icon
- Inactive tab: Gray text, lighter icon

---

## State Management

### State Architecture

The app uses **React Hooks** for state management:

```typescript
// Local state in booking.tsx
const [state, setState] = useState(initialValue);

// Side effects for data loading
useEffect(() => {
  if (isAuthenticated && currentUser) {
    loadSalons();
    loadMyBookings();
  }
}, [isAuthenticated, currentUser]);
```

### State Reset Strategy

**On Login**:
```typescript
// Clear previous selections
setSelectedSalon(null);
setSelectedServices([]);
setSelectedStaff(null);
setSelectedSchedule(null);
```

**On Logout**:
```typescript
// Clear everything including bookings
setMyBookings([]);
setIsAuthenticated(false);
```

**On Tab Switch to Home**:
```typescript
// Reset booking flow if not at salon/login/signup
if (step !== 'login' && step !== 'signup' && step !== 'salon') {
  setStep('salon');
  // Clear selections
}
```

---

## Data Flow

### Frontend → Backend Flow

```
┌─────────────────┐
│  User Action    │  (e.g., clicks "Confirm Booking")
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Event Handler  │  confirmBooking()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Service Layer  │  mockGraphQL.createBooking(params)
└────────┬────────┘
         │
         ▼ HTTP POST with GraphQL query
┌─────────────────┐
│ Apollo Server   │  receives mutation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Resolvers     │  createBooking resolver
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  File System    │  writeData(sampleData.json)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Response       │  Returns booking object
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update State   │  setMyBookings([...prev, booking])
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UI Update      │  Re-render with new booking
└─────────────────┘
```

---

## Backend Architecture

### GraphQL Schema (`backend/schema.ts`)

Defines the API contract:

**Types**:
- `Salon` - Salon details (id, name, address, rating)
- `Service` - Service info (id, name, price, salonId)
- `Staff` - Staff member (id, name, specialization, photo, salonId)
- `Schedule` - Time slot (id, time, isAvailable)
- `Booking` - Confirmed booking (id, userId, salon, services, staff, time)
- `User` - User account (id, name, phone, email)
- `AuthResponse` - Auth result (success, message, user)

**Queries**:
```graphql
getSalons: [Salon!]!
getServices(salonId: ID!): [Service!]!
getStaff(salonId: ID!): [Staff!]!
getStaffSchedules(staffId: ID!): [Schedule!]!
getBookings(userId: ID!): [Booking!]!
```

**Mutations**:
```graphql
createBooking(input: BookingInput!): Booking!
register(input: RegisterInput!): AuthResponse!
login(input: LoginInput!): AuthResponse!
```

### Resolvers (`backend/resolvers.ts`)

Business logic implementation:

**Helper Functions**:
- `readData()` - Reads from sampleData.json
- `writeData(data)` - Writes to sampleData.json
- `delay(ms)` - Simulates network latency

**Query Resolvers**:
- Filter data by IDs (e.g., services by salonId)
- Return relevant data subsets

**Mutation Resolvers**:
- **createBooking**: Validates input, creates booking, persists to JSON
- **register**: Validates user data, checks uniqueness, creates account
- **login**: Validates credentials, returns user data (without password)

### Data Persistence

**File**: `data/sampleData.json`

**Structure**:
```json
{
  "salons": [...],
  "services": [...],
  "staff": [...],
  "schedules": [...],
  "users": [...],
  "bookings": []
}
```

**Relationships**:
- Services have `salonId` → belong to specific salons
- Staff have `salonId` → work at specific salons
- Bookings have `userId` → belong to specific users

---

## Styling System

### Design Tokens (`styles/theme.ts`)

Centralized design system:

```typescript
// Colors
COLORS = {
  primary: '#FF9500',      // Orange
  background: '#f5f5f5',   // Light gray
  textPrimary: '#333',     // Dark text
  // ... more colors
}

// Spacing (4pt grid)
SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32
}

// Border Radius
BORDER_RADIUS = { sm: 8, md: 12, lg: 16 }

// Font Sizes
FONT_SIZES = { xs: 10, sm: 12, md: 14, ..., display: 32 }
```

### StyleSheet (`styles/booking.styles.ts`)

All styles organized by section:

**Usage**:
```typescript
import { styles } from '../styles/booking.styles';

<View style={styles.container}>
  <Text style={styles.stepTitle}>Select Salon</Text>
</View>
```

**Benefits**:
- Consistent spacing and colors
- Easy theme updates (change theme.ts, all styles update)
- Performance optimized (StyleSheet.create)
- Type-safe with TypeScript

---

## Authentication Flow

### Registration (`handleSignup`)

```
1. User fills signup form (name, phone, email, password, confirm)
2. Frontend validates password match
3. Calls mockGraphQL.register(params)
4. Apollo Server validates:
   - Email uniqueness
   - Password length (min 6)
   - Phone format (min 10 digits)
5. On success:
   - User saved to sampleData.json
   - Auto-switch to login screen
   - Pre-fill email
   - Show success alert
```

### Login (`handleLogin`)

```
1. User enters email and password
2. Calls mockGraphQL.login(params)
3. Apollo Server checks credentials
4. On success:
   - Set isAuthenticated = true
   - Set currentUser
   - Clear all selections (fresh start)
   - Load salons and user's bookings
   - Navigate to salon selection
```

### Logout (`handleLogout`)

```
1. Clear authentication state
2. Clear all selections
3. Clear bookings
4. Return to login screen
```

---

## Booking Flow

### Step-by-Step Process

#### Step 1: Select Salon (`handleSalonSelect`)
```typescript
1. User clicks a salon card
2. Save selectedSalon
3. Fetch services for that salon
4. Navigate to services step
```

#### Step 2: Select Services (`toggleService`, `proceedToStaff`)
```typescript
1. User checks/unchecks services (multi-select)
2. Each click toggles service in selectedServices array
3. On "Continue":
   - Validate at least one service selected
   - Fetch staff for the salon
   - Navigate to staff step
```

#### Step 3: Select Staff (`handleStaffSelect`)
```typescript
1. User clicks a staff member
2. Save selectedStaff
3. Fetch staff's schedule
4. Navigate to schedule step
```

#### Step 4: Select Schedule (`handleScheduleSelect`)
```typescript
1. User clicks a time slot (only if available)
2. Save selectedSchedule
3. Navigate to confirmation step
```

#### Step 5: Confirmation (`confirmBooking`)
```typescript
1. Display booking summary
2. On "Confirm":
   - Create booking via mockGraphQL.createBooking()
   - Add booking to myBookings state
   - Navigate to success step
```

#### Step 6: Success
```typescript
1. Show booking details
2. Options:
   - View My Bookings → Switch to bookings tab
   - Book Another Appointment → Reset flow
```

### Back Navigation (`handleBack`)

```typescript
confirmation → schedule  // Keep selection
schedule → staff        // Clear schedule
staff → services       // Clear staff
services → salon       // Clear services
```

---

## Key Functions

### Data Loading

**`loadSalons()`**
- Fetches all salons from backend
- Sets loading state
- Updates salons array

**`loadMyBookings()`**
- Fetches user-specific bookings
- Filters by currentUser.id
- Updates myBookings array

### Booking Management

**`confirmBooking()`**
- Validates all selections
- Creates booking via GraphQL
- Persists to backend
- Updates local state
- Shows success screen

**`resetBooking()`**
- Clears all selections
- Returns to salon step
- Reloads salon data

### Utilities

**`getTotalPrice()`**
- Sums selected service prices
- Used in confirmation screen

**`shouldShowBack()`**
- Determines back button visibility
- Hidden on: login, signup, salon, success

---

## Service Layer (`services/mockGraphQLService.ts`)

### Purpose
Acts as an intermediary between frontend and Apollo Server.

### Key Functions

**Queries**:
```typescript
getSalons(): Promise<Salon[]>
getServices(salonId): Promise<Service[]>
getStaff(salonId): Promise<Staff[]>
getStaffSchedules(staffId): Promise<Schedule[]>
getBookings(userId): Promise<Booking[]>
```

**Mutations**:
```typescript
createBooking(params): Promise<Booking>
register(params): Promise<AuthResponse>
login(params): Promise<AuthResponse>
```

### Implementation Pattern
```typescript
getServices: async (salonId: string) => {
  const response = await fetch(APOLLO_SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query GetServices($salonId: ID!) { ... }`,
      variables: { salonId }
    })
  });
  const result = await response.json();
  return result.data.getServices;
}
```

---

## Best Practices Implemented

### 1. **Separation of Concerns**
- UI logic in components
- Business logic in resolvers
- Data access in service layer
- Styles in separate files

### 2. **Type Safety**
- TypeScript throughout
- Explicit types for all data structures
- Type-safe props for components

### 3. **Code Reusability**
- Reusable components (AppBar, BottomNav)
- Centralized theme tokens
- Shared service layer

### 4. **State Management**
- Clear state organization
- Proper cleanup on logout/navigation
- Effects for side-effect management

### 5. **User Experience**
- Loading states for async operations
- Error handling with alerts
- Visual feedback for active states
- Simulated network delay for realism

### 6. **Data Persistence**
- File-based storage (simulates database)
- User-specific data filtering
- Transactional writes (read → modify → write)

---

## Running the Application

### Start Apollo Server (Backend)
```bash
npm run server
```
Server runs on `http://localhost:4000/graphql`

### Start React Native (Frontend)
```bash
npm start
```
Then press `w` for web, `a` for Android, or `i` for iOS

### Development Workflow
1. Start Apollo Server in one terminal
2. Start React Native in another terminal
3. Make changes to code
4. Hot reload updates automatically

---

## Testing Credentials

**Demo User**:
- Email: `demo@salon.com`
- Password: `demo123`

**Or create a new account** using the signup form.

---

## Future Enhancements

### Potential Improvements
1. **Real Database**: Replace JSON with PostgreSQL/MongoDB
2. **Real-time Updates**: Add GraphQL subscriptions
3. **Payment Integration**: Stripe/PayPal for bookings
4. **Push Notifications**: Booking reminders
5. **Image Upload**: Staff photos, salon galleries
6. **Reviews & Ratings**: User feedback system
7. **Calendar Integration**: Sync with Google Calendar
8. **Search & Filters**: Advanced salon/service search
9. **Multi-language**: i18n support
10. **Analytics**: Booking patterns, popular services

---

## Troubleshooting

### Apollo Server Not Running
```bash
# Kill existing process on port 4000
npx kill-port 4000

# Restart server
npm run server
```

### State Not Clearing
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Data Not Persisting
- Check that Apollo Server is running
- Verify `sampleData.json` exists and is writable
- Check browser console for GraphQL errors

---

## Conclusion

This application demonstrates:
- ✅ Full-stack TypeScript development
- ✅ React Native mobile app development
- ✅ GraphQL API design and implementation
- ✅ State management with React Hooks
- ✅ Component-based architecture
- ✅ User authentication and authorization
- ✅ Multi-step user workflows
- ✅ Data persistence and CRUD operations
- ✅ Responsive, modern UI design
- ✅ Clean, documented, maintainable code

All code is well-documented with JSDoc comments and follows industry best practices.
