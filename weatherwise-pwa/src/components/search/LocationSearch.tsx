import { useState, type KeyboardEvent } from 'react';
import { IoSearch, IoLocationSharp, IoClose, IoTrendingUp } from 'react-icons/io5';
import { useLocationStore } from '../../store/locations-store';

interface LocationSearchProps {
  placeholder?: string;
  className?: string;
}

/**
 * Premium location search with glass morphism and smooth animations
 */
export function LocationSearch({ placeholder = 'Search destinations...', className = '' }: LocationSearchProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addLocation, locations, maxLocations } = useLocationStore();

  // Popular destinations for quick access
  const popularLocations = [
    'Tokyo, Japan',
    'Paris, France',
    'New York, USA',
    'London, UK',
    'Bali, Indonesia',
    'Maldives',
    'Barcelona, Spain',
    'Dubai, UAE',
    'Sydney, Australia',
    'Rome, Italy',
    'Bangkok, Thailand',
    'Singapore',
  ];

  const filteredSuggestions = input.length > 0
    ? popularLocations.filter((loc) =>
        loc.toLowerCase().includes(input.toLowerCase())
      )
    : popularLocations;

  const handleAddLocation = (location: string) => {
    if (location.trim() && !locations.includes(location)) {
      addLocation(location);
      setInput('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      handleAddLocation(input.trim());
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (location: string) => {
    handleAddLocation(location);
  };

  const isMaxReached = locations.length >= maxLocations;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 group-focus-within:opacity-30 transition-opacity duration-300"></div>

        <div className="relative backdrop-blur-sm bg-white/80 rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <IoSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={isMaxReached ? `Maximum ${maxLocations} locations` : placeholder}
            disabled={isMaxReached}
            className="w-full pl-14 pr-14 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          />
          {input && (
            <button
              onClick={() => setInput('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-all"
              type="button"
            >
              <IoClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && !isMaxReached && filteredSuggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-3 backdrop-blur-md bg-white/90 border border-white/50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {input.length === 0 && (
            <div className="px-6 py-3 bg-gradient-to-r from-gray-50/80 to-blue-50/80 border-b border-white/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <IoTrendingUp className="w-4 h-4 text-blue-500" />
                Popular Destinations
              </div>
            </div>
          )}
          <div className="max-h-80 overflow-y-auto">
            {filteredSuggestions.map((location, index) => (
              <button
                key={location}
                onClick={() => handleSuggestionClick(location)}
                className="w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 flex items-center gap-4 transition-all group border-b border-white/30 last:border-0"
                type="button"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
                  <IoLocationSharp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-800 font-medium group-hover:text-blue-900 transition-colors">
                  {location}
                </span>
              </button>
            ))}
            {input.length > 0 && filteredSuggestions.length === 0 && (
              <div className="px-6 py-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/80 rounded-full">
                  <IoSearch className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Press <kbd className="px-2 py-0.5 bg-white rounded text-xs font-semibold">Enter</kbd> to search for "{input}"
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
