import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFlights } from "../../store/slices/bookingSlice";
import HamburgerMenu from "../../components/HamburgerMenu";

import SearchSuggestions from "../../components/SearchSuggestions";
import { convertCurrency, formatCurrency } from "../../utils/currencyUtils";
import {Plane, Search, Calendar, MapPin, Clock, Users } from "lucide-react";
import "../../styles/EmployeeDashboard.css";

const FlightBooking: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { flights, loading } = useAppSelector(state => state.booking);
  const { currentCurrency, exchangeRate } = useAppSelector(state => state.currency);

  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1
  });

  const [filteredFlights, setFilteredFlights] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  useEffect(() => {
    if (searchForm.from && searchForm.to && searchForm.date) {
      const filtered = flights.filter((flight: any) =>
        flight.from.toLowerCase().includes(searchForm.from.toLowerCase()) &&
        flight.to.toLowerCase().includes(searchForm.to.toLowerCase()) &&
        flight.date === searchForm.date &&
        flight.available
      );
      setFilteredFlights(filtered);
    } else {
      setFilteredFlights([]);
    }
  }, [searchForm, flights]);

  // Generate suggestions based on search term
  useEffect(() => {
    if (!activeField) return;

    const searchTerm = activeField === 'from' ? searchForm.from : searchForm.to;

    if (searchTerm.length > 1) {
      const uniqueCities = [...new Set(flights.map((flight: any) =>
        activeField === 'from' ? flight.from : flight.to
      ))];

      const citySuggestions = uniqueCities
        .filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5)
        .map((city, index) => ({
          id: `city-${index}`,
          name: city,
          type: 'flight' as const,
          city: city
        }));

      setSuggestions(citySuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchForm.from, searchForm.to, activeField, flights]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (item: any) => {
    if (activeField === 'from') {
      setSearchForm({ ...searchForm, from: item.city });
    } else if (activeField === 'to') {
      setSearchForm({ ...searchForm, to: item.city });
    }
    setShowSuggestions(false);
    setActiveField(null);
  };

  const handleBookFlight = async (flight: any) => {
    if (!user?.id) return;

    const bookingData = {
      employeeId: user.id,
      type: 'flight',
      from: flight.from,
      to: flight.to,
      date: flight.date,
      amount: flight.price * searchForm.passengers,
      status: 'confirmed',
      bookingDetails: {
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        passengers: searchForm.passengers
      }
    };

    // const result = await dispatch(createBooking(bookingData));
    // if (createBooking.fulfilled.match(result)) {
    //   alert(`Flight booked successfully! Booking ID: ${result.payload.id}`);
    //   navigate("/employee/dashboard");
    // }
  };

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <HamburgerMenu />
          </div>
          <h1>Flight Booking</h1>
          <div className="header-actions">
            
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Search Form */}
        <section className="search-section">
          <h2>Search Flights</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group" style={{ position: 'relative' }}>
                <label>
                  <MapPin size={16} />
                  From
                </label>
                <input
                  type="text"
                  value={searchForm.from}
                  onChange={(e) => setSearchForm({...searchForm, from: e.target.value})}
                  onFocus={() => setActiveField('from')}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Departure city"
                  required
                />
                {activeField === 'from' && (
                  <SearchSuggestions
                    suggestions={suggestions}
                    onSelect={handleSuggestionSelect}
                    visible={showSuggestions}
                    searchTerm={searchForm.from}
                  />
                )}
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>
                  <MapPin size={16} />
                  To
                </label>
                <input
                  type="text"
                  value={searchForm.to}
                  onChange={(e) => setSearchForm({...searchForm, to: e.target.value})}
                  onFocus={() => setActiveField('to')}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Destination city"
                  required
                />
                {activeField === 'to' && (
                  <SearchSuggestions
                    suggestions={suggestions}
                    onSelect={handleSuggestionSelect}
                    visible={showSuggestions}
                    searchTerm={searchForm.to}
                  />
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Date
                </label>
                <input
                  type="date"
                  value={searchForm.date}
                  onChange={(e) => setSearchForm({...searchForm, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <Users size={16} />
                  Passengers
                </label>
                <select
                  value={searchForm.passengers}
                  onChange={(e) => setSearchForm({...searchForm, passengers: parseInt(e.target.value)})}
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="search-button">
              <Search size={16} />
              Search Flights
            </button>
          </form>
        </section>

        {/* Flight Results */}
        <section className="results-section">
          <h2>Available Flights</h2>
          {loading ? (
            <div className="loading">Searching flights...</div>
          ) : filteredFlights.length > 0 ? (
            <div className="flight-list">
              {filteredFlights.map((flight) => {
                const convertedPrice = convertCurrency(flight.price, 'INR', currentCurrency, exchangeRate);
                const totalPrice = convertedPrice * searchForm.passengers;
                return (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-header">
                      <div className="flight-info">
                        <h3>{flight.airline}</h3>
                        <p className="flight-number">{flight.flightNumber}</p>
                        <div className="route">
                          <span className="from">{flight.from}</span>
                          <span className="arrow">→</span>
                          <span className="to">{flight.to}</span>
                        </div>
                      </div>
                      <div className="flight-price">
                        <span className="price">{formatCurrency(totalPrice, currentCurrency)}</span>
                        <span className="per-passenger">({formatCurrency(convertedPrice, currentCurrency)} per passenger)</span>
                      </div>
                    </div>

                    <div className="flight-details">
                      <div className="timing">
                        <div className="departure">
                          <Clock size={16} />
                          <span>Departure: {flight.departureTime}</span>
                        </div>
                        <div className="arrival">
                          <Clock size={16} />
                          <span>Arrival: {flight.arrivalTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flight-actions">
                      <div className="flight-meta">
                        <span className="date">{flight.date}</span>
                        <span className="availability">Available</span>
                      </div>
                      <button
                        onClick={() => handleBookFlight(flight)}
                        className="book-button"
                        disabled={!searchForm.from || !searchForm.to || !searchForm.date}
                      >
                        Book Flight
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : searchForm.from && searchForm.to && searchForm.date ? (
            <div className="no-results">
              <Plane size={48} />
              <h3>No flights found</h3>
              <p>Try searching for different dates or routes.</p>
            </div>
          ) : (
            <div className="search-prompt">
              <Search size={48} />
              <h3>Search for flights</h3>
              <p>Enter departure and destination cities to find available flights.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FlightBooking; 