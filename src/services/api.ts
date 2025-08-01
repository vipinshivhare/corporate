import axios from 'axios';

const API_BASE_URL = 'https://corporate-travel-api.onrender.com/data';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'employee' | 'manager';
  password: string;
  department?: string;
  budget?: number;
  walletBalance?: number;
  rewardPoints?: number;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  budget: number;
  usedBudget: number;
  walletBalance: number;
  rewardPoints: number;
}

interface Expense {
  id: number;
  employeeId: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
}

interface Booking {
  id: number;
  employeeId: number;
  type: 'flight' | 'hotel' | 'pickup';
  from?: string;
  to?: string;
  city?: string;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  amount: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  bookingDetails: Record<string, unknown>;
}

interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  available: boolean;
}

interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  rating: number;
  pricePerNight: number;
  available: boolean;
  amenities: string[];
}

interface Pickup {
  id: number;
  city: string;
  pickupLocation: string;
  dropLocation: string;
  vehicleType: string;
  price: number;
  available: boolean;
}

interface ApiData {
  users: User[];
  employees: Employee[];
  expenses: Expense[];
  bookings: Booking[];
  flights: Flight[];
  hotels: Hotel[];
  pickups: Pickup[];
}

// Cache the API data to avoid multiple requests
let cachedData: ApiData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchApiData = async (): Promise<ApiData> => {
  const now = Date.now();
  
  // Return cached data if it's still valid
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedData!;
  }
  
  try {
    const response = await axios.get(API_BASE_URL);
    cachedData = response.data;
    lastFetchTime = now;
    return cachedData!;
  } catch (error) {
    console.error('Failed to fetch API data:', error);
    throw error;
  }
};

// API functions for different data types
export const apiService = {
  // Users
  getUsers: async () => {
    const data = await fetchApiData();
    return data.users;
  },
  
  getUserByEmail: async (email: string) => {
    const data = await fetchApiData();
    return data.users.filter(user => user.email === email);
  },
  
  // Employees
  getEmployees: async () => {
    const data = await fetchApiData();
    return data.employees;
  },
  
  // Expenses
  getExpenses: async (employeeId?: number) => {
    const data = await fetchApiData();
    if (employeeId) {
      return data.expenses.filter(expense => expense.employeeId === employeeId);
    }
    return data.expenses;
  },
  
  // Bookings
  getBookings: async (employeeId?: number) => {
    const data = await fetchApiData();
    if (employeeId) {
      return data.bookings.filter(booking => booking.employeeId === employeeId);
    }
    return data.bookings;
  },
  
  // Flights
  getFlights: async () => {
    const data = await fetchApiData();
    return data.flights;
  },
  
  // Hotels
  getHotels: async () => {
    const data = await fetchApiData();
    return data.hotels;
  },
  
  // Pickups
  getPickups: async () => {
    const data = await fetchApiData();
    return data.pickups;
  },
  
  // Clear cache (useful for testing or forcing refresh)
  clearCache: () => {
    cachedData = null;
    lastFetchTime = 0;
  }
}; 