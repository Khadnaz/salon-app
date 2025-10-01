# Apollo Server Backend

## 🚀 Quick Start

### Start the GraphQL server:
```bash
npm run server
```

Server will start on: **http://localhost:4000/graphql**

---

## 📋 What's Included

### **Files:**
- `server.ts` - Apollo Server setup and configuration
- `schema.ts` - GraphQL type definitions (typeDefs)
- `resolvers.ts` - Query and mutation handlers

### **GraphQL Schema:**
- **Types**: Salon, Service, Staff, Schedule, Booking
- **Queries**: getSalons, getServices, getStaff, getStaffSchedules
- **Mutations**: createBooking

---

## 🧪 Testing

### **GraphQL Playground:**
Open: **http://localhost:4000/graphql**

### **Example Queries:**

```graphql
# Get all salons
{
  getSalons {
    id
    name
    rating
  }
}

# Get services for a salon
{
  getServices(salonId: "1") {
    name
    price
  }
}

# Get staff for a salon
{
  getStaff(salonId: "1") {
    name
    specialization
  }
}
```

### **Example Mutation:**

```graphql
mutation {
  createBooking(input: {
    salonId: "1"
    serviceIds: ["1"]
    staffId: "1"
    time: "10:00 AM"
  }) {
    id
    salon { name }
    services { name price }
    staff { name }
    time
  }
}
```

---

## 📊 Data Source

All data comes from: `data/sampleData.json`

**Realistic structure:**
- Services filtered by salon
- Staff filtered by salon
- Proper relationships maintained

---

## 🔧 Development

### **Watch mode** (auto-reload on changes):
```bash
npm run server:watch
```

### **Console output:**
- GraphQL endpoint URL
- Query/mutation logs
- Request timing

---

## ✅ Features

- ✅ GraphQL schema matches requirements
- ✅ Resolvers filter data properly (salon-specific)
- ✅ Simulated network delays (realistic)
- ✅ Error handling
- ✅ Console logging for debugging
- ✅ TypeScript support

---

## 🎯 Integration

### **Frontend can query using:**

**Apollo Client:**
```tsx
import { useQuery } from '@apollo/client';
import { GET_SALONS } from '../graphql/queries';

const { data } = useQuery(GET_SALONS);
```

**Direct HTTP:**
```tsx
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: '{ getSalons { id name } }'
  })
});
```

---

## 📚 Learn More

- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL Schema](https://graphql.org/learn/schema/)
- [Resolvers Guide](https://www.apollographql.com/docs/apollo-server/data/resolvers/)
