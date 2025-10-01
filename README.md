# Salon Booking App

A React Native salon booking application with mock GraphQL backend simulation served via Apollo.

## Overview

This app demonstrates a complete salon booking flow with authentication, built with React Native and Expo. It uses a simple mock GraphQL service to simulate backend interactions.

![Screenshot_1-10-2025_81442_localhost](https://github.com/user-attachments/assets/79713528-1dfe-4747-b6ea-aa57dc161f95)
![Screenshot_1-10-2025_81427_localhost](https://github.com/user-attachments/assets/dabaa4e2-bee2-4cdd-b387-e79380b537bc)
![Screenshot_1-10-2025_8158_localhost](https://github.com/user-attachments/assets/a2466180-2bf2-4c20-aad1-2a84f754655a)
![Screenshot_1-10-2025_81532_localhost](https://github.com/user-attachments/assets/907189a6-542f-401c-8ec3-986f51038250)
<img width="306" height="457" alt="apollo" src="https://github.com/user-attachments/assets/f409a1bc-2519-4487-b9f7-c9eff12ce620" />


## Features

**User Authentication** - Registration and login with email/password (name & phone required)  
**Salon Selection** - Browse and select from available salons  
**Service Selection** - Choose multiple services with pricing  
**Staff Selection** - Pick from available staff members with photos  
**Schedule Selection** - Select available time slots  
**Booking Confirmation** - Review and confirm booking details  
**Mock GraphQL Backend** - Simulates API queries and mutations  

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the Apollo server
npm run server

# Start the app in a another terminal
npx expo start
```

### Run on Platform

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your phone

### Demo Credentials

You can create a new account via the "Sign Up" screen, or use:

**Email:** demo@salon.com  
**Password:** demo123

## Project Structure

```
salon-booking/
├── app/
│   ├── booking.tsx                    # Main application
│   ├── index.tsx                      # Entry point
│   ├── _layout.tsx                    # Root layout
│   └── +not-found.tsx                 # 404 page
├── services/
│   └── mockGraphQLService.ts          # GraphQL backend simulation
├── data/
│   └── sampleData.json                # Sample data
├── assets/
│   └── images/                        # App icons
└── docs/
    ├── IMPLEMENTATION-GUIDE.md        # Detailed implementation guide
    ├── AUTH-OPTIONS.md                # Authentication options
    └── REQUIREMENTS-CHECKLIST.md      # Requirements checklist
```

## 🔧 Technical Details

### Mock GraphQL Backend

The app simulates a GraphQL backend using `services/mockGraphQLService.ts`:

**Queries:**
- `getSalons()` - Fetch all salons
- `getServices(salonId)` - Fetch services for a salon
- `getServices(salonId)` - Fetch staff for a salon
- `getStaffSchedules(staffId)` - Fetch available time slots

**Mutations:**
- `createBooking(...)` - Create a new booking

All functions include simulated network delays (300-500ms) for realistic behavior.

### Data Source

Sample data is stored in `data/sampleData.json` following the GraphQL schema:

```json
{
  "salons": [...],      // 2 salons
  "services": [...],    // 3 services
  "staff": [...],       // 2 staff members
  "schedules": [...]    // 5 time slots
}
```

## User Flow

1. **Login** - Enter credentials (demo@salon.com / demo123)
2. **Select Salon** - Choose from available salons
3. **Select Services** - Pick one or more services (shows total)
4. **Select Staff** - Choose a staff member
5. **Select Time** - Pick an available time slot
6. **Confirm** - Review and confirm booking

## Application Features

The app includes user authentication to enable:
- Personalized booking management
- Booking history tracking
- User profile information
- Secure booking confirmation

## Code Statistics

- **Total Custom Code:** ~450 lines
- **Number of Files:** 4 core files
- **Components:** All-in-one design
- **Dependencies:** Minimal (React Native + Expo)

## 🛠 Development

### File Structure Breakdown

**Essential Files:**
- `app/booking.tsx` - Main application with authentication
- `services/mockGraphQLService.ts` - Backend simulation
- `data/sampleData.json` - Sample data
- `package.json` - Dependencies

**Configuration:**
- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript config
- `expo-env.d.ts` - TypeScript definitions

## Documentation

- **`IMPLEMENTATION-GUIDE.md`** - Complete implementation guide
- **`docs/AUTH-OPTIONS.md`** - Authentication options explained
- **`docs/REQUIREMENTS-CHECKLIST.md`** - Requirements verification

## Requirements Met

### Core Features: 
- Salon selection with mock data
- Multi-service selection
- Staff selection with photos
- Schedule/time slot selection
- Booking confirmation screen

### Backend Implementation: 
- Mock GraphQL API
- Local JSON data source
- Queries simulation
- Mutations simulation
- Network delay simulation

### Cross-Platform: 
- iOS support
- Android support
- Web support

## Contributing

This is a demo project for evaluation purposes.

## License

MIT

---

**Built with ❤️ using React Native & Expo**

For detailed documentation, see `IMPLEMENTATION-GUIDE.md`
