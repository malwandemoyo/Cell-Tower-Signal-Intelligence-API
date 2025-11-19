// components/SearchBar.tsx
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Real-time search as user types
    if (value.length === 0 || value.length > 2) {
      onSearch(value);
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    onSearch(exampleQuery);
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-input-group">
          <div className="search-icon">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by radio (LTE, GSM), MCC (655), Cell ID, signal strength..."
            value={query}
            onChange={handleChange}
            className="search-input"
            disabled={loading}
          />
          {query && (
            <button type="button" onClick={handleClear} className="clear-btn">
              <X size={16} />
            </button>
          )}
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      <div className="search-examples">
        <span className="example-tag">Quick filters:</span>
        <button 
          type="button" 
          onClick={() => handleExampleClick('LTE')} 
          className="example-btn"
          disabled={loading}
        >
          LTE
        </button>
        <button 
          type="button" 
          onClick={() => handleExampleClick('655')} 
          className="example-btn"
          disabled={loading}
        >
          South Africa
        </button>
        <button 
          type="button" 
          onClick={() => handleExampleClick('-70')} 
          className="example-btn"
          disabled={loading}
        >
          Strong Signal
        </button>
        <button 
          type="button" 
          onClick={() => handleExampleClick('50')} 
          className="example-btn"
          disabled={loading}
        >
          High Samples
        </button>
      </div>
    </div>
  );
};

export default SearchBar;