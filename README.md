# Corporate Travel Management System

A comprehensive React + TypeScript frontend application for managing corporate travel bookings, expenses, and approvals.

##  Features

### Authentication
- Role-based login (Employee & Manager)
- Session management with localStorage
- Protected routes

### Employee Portal
- **Dashboard**: Wallet balance, budget tracking, reward points
- **Flight Booking**: Search and book flights with real-time pricing
- **Hotel Booking**: Find and reserve hotels with amenities
- **Airport Pickup**: Arrange transportation services
- **Expense Reporting**: Submit and track expense claims
- **Booking History**: View all past bookings with filters

### Manager Portal
- **Dashboard**: Team budget overview, expense analytics
- **Team Management**: View and manage employee budgets
- **Expense Approvals**: Review and approve/reject expense claims
- **Reports & Charts**: Visual analytics with Recharts

##  Tech Stack

- **Framework**: React 19 + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Custom CSS (Modern Design)
- **Forms**: React Hook Form + Yup validation
- **API Calls**: Axios
- **Routing**: React Router DOM v6+
- **Mock APIs**: JSON Server
- **Charts**: Recharts

##  Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd corporate-travel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the mock API server**
   ```bash
   npm run server
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

##  Login Credentials

### Employee
- Email: `employee@example.com`
- Password: `emp123`

### Manager
- Email: `manager@example.com`
- Password: `mgr123`

##  Project Structure

```
src/
├── components/          # Reusable UI components
├── features/           # Feature-based components
│   ├── auth/          # Authentication
│   ├── employee/      # Employee portal features
│   └── manager/       # Manager portal features
├── store/             # Redux store configuration
│   └── slices/        # Redux Toolkit slices
├── styles/            # CSS files
├── utils/             # Utility functions
└── types/             # TypeScript type definitions
```

##  Key Features

### Employee Features
- **Real-time Booking**: Search and book flights, hotels, and pickups
- **Wallet Management**: Track balance and deduct booking costs
- **Expense Submission**: Upload receipts and submit claims
- **Booking History**: Filter and view past bookings

### Manager Features
- **Team Overview**: Monitor employee budgets and expenses
- **Approval System**: Review and approve expense claims
- **Budget Management**: Allocate and update employee budgets
- **Analytics**: Visual charts for expense trends

##  Design System

- **Modern UI**: Clean, professional design
- **Responsive**: Works on all device sizes
- **Accessibility**: WCAG compliant components
- **Dark Mode Ready**: Prepared for theme switching

##  Deployment

The application is ready for deployment on:
- Vercel
- Netlify
- Any static hosting service

##  API Endpoints

The application uses JSON Server with the following endpoints:
- `GET /users` - User authentication
- `GET /employees` - Employee data
- `GET /expenses` - Expense management
- `GET /bookings` - Booking history
- `GET /flights` - Flight search
- `GET /hotels` - Hotel search
- `GET /pickups` - Pickup services

##  Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run server` - Start mock API server
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

##  License

This project is created for educational purposes and demonstrates modern React development practices.
