import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchHotels } from "../../store/slices/bookingSlice";
import HamburgerMenu from "../../components/HamburgerMenu";
import SearchSuggestions from "../../components/SearchSuggestions";
import { convertCurrency, formatCurrency } from "../../utils/currencyUtils";
import { Hotel, Search, Calendar, MapPin, Star, Users } from "lucide-react";
import "../../styles/EmployeeDashboard.css";

const HotelBooking: React.FC = () => {
  const dispatch = useAppDispatch();
  // const { user } = useAppSelector(state => state.auth);
  const { hotels, loading } = useAppSelector(state => state.booking);
  const { currentCurrency, exchangeRate } = useAppSelector(state => state.currency);

  const [searchForm, setSearchForm] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1
  });

  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  useEffect(() => {
    if (searchForm.city) {
      const filtered = hotels.filter((hotel: any) =>
        hotel.city.toLowerCase().includes(searchForm.city.toLowerCase()) &&
        hotel.available
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels([]);
    }
  }, [searchForm.city, hotels]);

  // Generate suggestions based on search term
  useEffect(() => {
    if (searchForm.city.length > 1) {
      const hotelSuggestions = hotels
        .filter((hotel: any) =>
          hotel.name.toLowerCase().includes(searchForm.city.toLowerCase()) ||
          hotel.city.toLowerCase().includes(searchForm.city.toLowerCase())
        )
        .slice(0, 5)
        .map((hotel: any) => ({
          id: `hotel-${hotel.id}`,
          name: hotel.name,
          type: 'hotel' as const,
          city: hotel.city,
          rating: hotel.rating,
          price: hotel.pricePerNight
        }));

      setSuggestions(hotelSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchForm.city, hotels]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (item: any) => {
    setSearchForm({ ...searchForm, city: item.city });
    setShowSuggestions(false);
  };

  const handleBookHotel = async () => {
    // Function currently does nothing; removed unused parameters and variables to fix TS errors
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "#fbbf24" : "#e5e7eb"}
        color={i < rating ? "#fbbf24" : "#e5e7eb"}
      />
    ));
  };

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <HamburgerMenu />
          </div>
          <h1>Hotel Booking</h1>
          <div className="header-actions">
            
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Search Form */}
        <section className="search-section">
          <h2>Search Hotels</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group" style={{ position: 'relative' }}>
                <label>
                  <MapPin size={16} />
                  City
                </label>
                <input
                  type="text"
                  value={searchForm.city}
                  onChange={(e) => setSearchForm({...searchForm, city: e.target.value})}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Enter city name"
                  required
                />
                <SearchSuggestions
                  suggestions={suggestions}
                  onSelect={handleSuggestionSelect}
                  visible={showSuggestions}
                  searchTerm={searchForm.city}
                />
              </div>
              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={searchForm.checkIn}
                  onChange={(e) => setSearchForm({...searchForm, checkIn: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={searchForm.checkOut}
                  onChange={(e) => setSearchForm({...searchForm, checkOut: e.target.value})}
                  min={searchForm.checkIn}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <Users size={16} />
                  Guests
                </label>
                <select
                  value={searchForm.guests}
                  onChange={(e) => setSearchForm({...searchForm, guests: parseInt(e.target.value)})}
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <Hotel size={16} />
                  Rooms
                </label>
                <select
                  value={searchForm.rooms}
                  onChange={(e) => setSearchForm({...searchForm, rooms: parseInt(e.target.value)})}
                >
                  {[1,2,3,4].map(num => (
                    <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="search-button">
              <Search size={16} />
              Search Hotels
            </button>
          </form>
        </section>

        {/* Hotel Results */}
        <section className="results-section">
          <h2>Available Hotels</h2>
          {loading ? (
            <div className="loading">Searching hotels...</div>
          ) : filteredHotels.length > 0 ? (
            <div className="hotel-list">
              {filteredHotels.map((hotel) => {
                const convertedPrice = convertCurrency(hotel.pricePerNight, 'INR', currentCurrency, exchangeRate);
                return (
                  <div key={hotel.id} className="hotel-card">
                    <div className="hotel-header">
                      <div className="hotel-info">
                        <h3>{hotel.name}</h3>
                        <p className="address">{hotel.address}</p>
                        <div className="rating">
                          {renderStars(hotel.rating)}
                          <span className="rating-text">{hotel.rating}/5</span>
                        </div>
                      </div>
                      <div className="hotel-price">
                        <span className="price">{formatCurrency(convertedPrice, currentCurrency)}</span>
                        <span className="per-night">per night</span>
                      </div>
                    </div>

                    <div className="hotel-details">
                      <div className="amenities">
                        <h4>Amenities:</h4>
                        <div className="amenities-list">
                          {hotel.amenities.map((amenity: string, index: number) => (
                            <span key={index} className="amenity-tag">{amenity}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="hotel-actions">
                      <div className="hotel-meta">
                        <span className="city">{hotel.city}</span>
                        <span className="availability">Available</span>
                      </div>
                      <button
                        onClick={handleBookHotel}
                        className="book-button"
                        disabled={!searchForm.checkIn || !searchForm.checkOut}
                      >
                        Book Hotel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : searchForm.city ? (
            <div className="no-results">
              <Hotel size={48} />
              <h3>No hotels found</h3>
              <p>Try searching for a different city or check availability for different dates.</p>
            </div>
          ) : (
            <div className="search-prompt">
              <Search size={48} />
              <h3>Search for hotels</h3>
              <p>Enter a city name to find available hotels.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HotelBooking; 