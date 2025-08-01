import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
  bookingDetails: any;
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

interface BookingState {
  bookings: Booking[];
  flights: Flight[];
  hotels: Hotel[];
  pickups: Pickup[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  flights: [],
  hotels: [],
  pickups: [],
  loading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (employeeId: number) => {
    const response = await axios.get(`http://localhost:3001/bookings?employeeId=${employeeId}`);
    return response.data;
  }
);

export const fetchFlights = createAsyncThunk(
  'booking/fetchFlights',
  async () => {
    const response = await axios.get('http://localhost:3001/flights');
    return response.data;
  }
);

export const fetchHotels = createAsyncThunk(
  'booking/fetchHotels',
  async () => {
    const response = await axios.get('http://localhost:3001/hotels');
    return response.data;
  }
);

export const fetchPickups = createAsyncThunk(
  'booking/fetchPickups',
  async () => {
    const response = await axios.get('http://localhost:3001/pickups');
    return response.data;
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: Omit<Booking, 'id'>) => {
    const response = await axios.post('http://localhost:3001/bookings', bookingData);
    return response.data;
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.flights = action.payload;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.hotels = action.payload;
      })
      .addCase(fetchPickups.fulfilled, (state, action) => {
        state.pickups = action.payload;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer; 