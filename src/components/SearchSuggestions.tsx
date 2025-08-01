import React from 'react';
import { Hotel, Plane, MapPin, Star, Clock } from 'lucide-react';

interface SuggestionItem {
  id: string;
  name: string;
  type: 'hotel' | 'flight';
  city?: string;
  airline?: string;
  rating?: number;
  price?: number;
  departureTime?: string;
  arrivalTime?: string;
}

interface SearchSuggestionsProps {
  suggestions: SuggestionItem[];
  onSelect: (item: SuggestionItem) => void;
  visible: boolean;
  searchTerm: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
  visible,
  searchTerm
}) => {
  if (!visible || suggestions.length === 0) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={12} 
        fill={i < rating ? "#fbbf24" : "#e5e7eb"} 
        color={i < rating ? "#fbbf24" : "#e5e7eb"}
      />
    ));
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="highlight">{part}</span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className="search-suggestions">
      <div className="suggestions-container">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="suggestion-card"
            onClick={() => onSelect(item)}
          >
            <div className="suggestion-icon">
              {item.type === 'hotel' ? (
                <Hotel size={16} />
              ) : (
                <Plane size={16} />
              )}
            </div>
            
            <div className="suggestion-content">
              <div className="suggestion-header">
                <h4 className="suggestion-name">
                  {highlightText(item.name, searchTerm)}
                </h4>
                {item.type === 'hotel' && item.rating && (
                  <div className="suggestion-rating">
                    {renderStars(item.rating)}
                    <span className="rating-text">{item.rating}/5</span>
                  </div>
                )}
              </div>
              
              <div className="suggestion-details">
                {item.type === 'hotel' ? (
                  <div className="hotel-details">
                    <div className="location">
                      <MapPin size={12} />
                      <span>{item.city}</span>
                    </div>
                    {item.price && (
                      <div className="price">
                        ₹{item.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flight-details">
                    <div className="airline">
                      <span>{item.airline}</span>
                    </div>
                    <div className="timing">
                      <Clock size={12} />
                      <span>{item.departureTime} - {item.arrivalTime}</span>
                    </div>
                    {item.price && (
                      <div className="price">
                        ₹{item.price.toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="suggestion-type">
              <span className={`type-badge ${item.type}`}>
                {item.type === 'hotel' ? 'Hotel' : 'Flight'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions; 