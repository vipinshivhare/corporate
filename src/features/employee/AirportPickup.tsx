import React, { useState , useEffect} from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { MapPin, Calendar, Clock, Search } from "lucide-react";
import { fetchPickups, createBooking } from "../../store/slices/bookingSlice";
import HamburgerMenu from "../../components/HamburgerMenu";
import { Car } from "lucide-react";
import "../../styles/EmployeeDashboard.css";

const AirportPickup: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { pickups, loading } = useAppSelector(state => state.booking);

  const [searchForm, setSearchForm] = useState({
    city: "",
    date: "",
    time: "",
    passengers: 1
  });

  const [filteredPickups, setFilteredPickups] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchPickups());
  }, [dispatch]);

  useEffect(() => {
    if (searchForm.city && searchForm.date) {
      const filtered = pickups.filter((pickup: any) =>
        pickup.city.toLowerCase().includes(searchForm.city.toLowerCase()) &&
        pickup.date === searchForm.date &&
        pickup.available
      );
      setFilteredPickups(filtered);
    } else {
      setFilteredPickups([]);
    }
  }, [searchForm, pickups]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleBookPickup = async (pickup: any) => {
    if (!user?.id) return;

    const bookingData = {
      employeeId: user.id,
      type: 'pickup',
      city: pickup.city,
      date: pickup.date,
      amount: pickup.price * searchForm.passengers,
      status: 'confirmed',
      bookingDetails: {
        vehicleType: pickup.vehicleType,
        pickupLocation: pickup.pickupLocation,
        dropLocation: pickup.dropLocation,
        time: searchForm.time,
        passengers: searchForm.passengers
      }
    };

    // const result = await dispatch(createBooking(bookingData));
    // if (createBooking.fulfilled.match(result)) {
    //   alert(`Airport pickup booked successfully! Booking ID: ${result.payload.id}`);
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
          <h1>Airport Pickup</h1>
          <div className="header-actions">
            
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Search Form */}
        <section className="search-section">
          <h2>Search Airport Pickup</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <MapPin size={16} />
                  City
                </label>
                <input
                  type="text"
                  value={searchForm.city}
                  onChange={(e) => setSearchForm({...searchForm, city: e.target.value})}
                  placeholder="Enter city name"
                  required
                />
              </div>
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
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <Clock size={16} />
                  Time
                </label>
                <input
                  type="time"
                  value={searchForm.time}
                  onChange={(e) => setSearchForm({...searchForm, time: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <Car size={16} />
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
              Search Pickup
            </button>
          </form>
        </section>

        {/* Pickup Results */}
        <section className="results-section">
          <h2>Available Pickup Services</h2>
          {loading ? (
            <div className="loading">Searching pickup services...</div>
          ) : filteredPickups.length > 0 ? (
            <div className="pickup-list">
              {filteredPickups.map((pickup) => (
                <div key={pickup.id} className="pickup-card">
                  <div className="pickup-header">
                    <div className="pickup-info">
                      <h3>{pickup.vehicleType}</h3>
                      <p className="pickup-location">{pickup.pickupLocation} → {pickup.dropLocation}</p>
                    </div>
                    <div className="pickup-price">
                      <span className="price">₹{pickup.price.toLocaleString()}</span>
                      <span className="per-passenger">per passenger</span>
                    </div>
                  </div>

                  <div className="pickup-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{pickup.city}</span>
                      </div>
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>{pickup.date}</span>
                      </div>
                      <div className="detail-item">
                        <span className="availability">Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="pickup-actions">
                    <button
                      onClick={() => handleBookPickup(pickup)}
                      className="book-button"
                      disabled={!searchForm.city || !searchForm.date || !searchForm.time}
                    >
                      Book Pickup
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchForm.city && searchForm.date ? (
            <div className="no-results">
              <Car size={48} />
              <h3>No pickup services found</h3>
              <p>Try searching for a different city or date.</p>
            </div>
          ) : (
            <div className="search-prompt">
              <Search size={48} />
              <h3>Search for pickup services</h3>
              <p>Enter city and date to find available airport pickup services.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AirportPickup; 