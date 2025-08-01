import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBookings } from "../../store/slices/bookingSlice";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../../components/HamburgerMenu";
import { convertCurrency, formatCurrency } from "../../utils/currencyUtils";
import { Plane, Hotel, Car, Calendar, MapPin } from "lucide-react";
import "../../styles/EmployeeDashboard.css";

const BookingHistory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.auth);
  const { bookings, loading } = useAppSelector((state: any) => state.booking);
  const { currentCurrency, exchangeRate } = useAppSelector((state: any) => state.currency);

  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateRange: "all"
  });

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBookings(user.id));
    }
  }, [dispatch, user?.id]);

  const getFilteredBookings = () => {
    let filtered = [...bookings]; // Create a copy of the array

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((booking: any) => booking.type === filters.type);
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((booking: any) => booking.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((booking: any) => {
        const bookingDate = new Date(booking.date);
        switch (filters.dateRange) {
          case "30days":
            return bookingDate >= thirtyDaysAgo;
          case "90days":
            return bookingDate >= ninetyDaysAgo;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane size={20} />;
      case 'hotel':
        return <Hotel size={20} />;
      case 'pickup':
        return <Car size={20} />;
      default:
        return <Calendar size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getBookingDetails = (booking: any) => {
    switch (booking.type) {
      case 'flight':
        return `${booking.from} → ${booking.to}`;
      case 'hotel':
        return `${booking.city}`;
      case 'pickup':
        return `${booking.city}`;
      default:
        return 'Booking';
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <HamburgerMenu />
          </div>
          <h1>Booking History</h1>
          <div className="header-actions">
       
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Filters */}
        <section className="filters-section">
          <h2>Filters</h2>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Type:</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="all">All Types</option>
                <option value="flight">Flights</option>
                <option value="hotel">Hotels</option>
                <option value="pickup">Pickups</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range:</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">All Time</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </section>

        {/* Booking List */}
        <section className="bookings-section">
          <div className="section-header">
            <h2>Your Bookings</h2>
            <span className="booking-count">{filteredBookings.length} bookings found</span>
          </div>

          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : filteredBookings.length > 0 ? (
            <div className="booking-list">
              {filteredBookings.map((booking: any) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-type">
                      <div className="type-icon">
                        {getBookingIcon(booking.type)}
                      </div>
                      <div className="type-info">
                        <h3>{booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}</h3>
                        <p>{getBookingDetails(booking)}</p>
                      </div>
                    </div>
                    <div className="booking-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{booking.city || `${booking.from} - ${booking.to}`}</span>
                      </div>
                      <div className="detail-item">
                        <span className="amount">
                          {formatCurrency(
                            convertCurrency(booking.amount, 'INR', currentCurrency, exchangeRate),
                            currentCurrency
                          )}
                        </span>
                      </div>
                    </div>

                    {booking.bookingDetails && (
                      <div className="booking-specifics">
                        {booking.type === 'flight' && (
                          <div className="flight-details">
                            <p><strong>Airline:</strong> {booking.bookingDetails.airline}</p>
                            <p><strong>Flight:</strong> {booking.bookingDetails.flightNumber}</p>
                            <p><strong>Time:</strong> {booking.bookingDetails.departureTime} - {booking.bookingDetails.arrivalTime}</p>
                            <p><strong>Passengers:</strong> {booking.bookingDetails.passengers}</p>
                          </div>
                        )}
                        {booking.type === 'hotel' && (
                          <div className="hotel-details">
                            <p><strong>Hotel:</strong> {booking.bookingDetails.hotelName}</p>
                            <p><strong>Check-in:</strong> {new Date(booking.bookingDetails.checkIn).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> {new Date(booking.bookingDetails.checkOut).toLocaleDateString()}</p>
                            <p><strong>Guests:</strong> {booking.bookingDetails.guests}</p>
                          </div>
                        )}
                        {booking.type === 'pickup' && (
                          <div className="pickup-details">
                            <p><strong>Vehicle:</strong> {booking.bookingDetails.vehicleType}</p>
                            <p><strong>Pickup:</strong> {booking.bookingDetails.pickupLocation}</p>
                            <p><strong>Drop:</strong> {booking.bookingDetails.dropLocation}</p>
                            <p><strong>Time:</strong> {booking.bookingDetails.time}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    <button className="view-details-btn">
                      View Details
                    </button>
                    {booking.status === 'confirmed' && (
                      <button className="cancel-btn">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bookings">
              <Calendar size={48} />
              <h3>No bookings found</h3>
              <p>Try adjusting your filters or make your first booking!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BookingHistory; 