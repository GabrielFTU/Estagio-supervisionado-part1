import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function SharedToolbar({
  value,
  onChange,
  placeholder = 'Buscar...',
  filterValue,
  onFilterChange,
  filterOptions = []
}) {
  return (
    <div className="toolbar-container">
      <div className="search-box">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button className="btn-clear-search" onClick={() => onChange('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {filterOptions.length > 0 && (
        <div className="filter-box">
          <Filter size={20} className="filter-icon" />
          <select 
          className="select-standard"
          value={filterValue} 
          onChange={(e) => onFilterChange(e.target.value)}>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
