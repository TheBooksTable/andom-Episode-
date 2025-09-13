import React from 'react';
import type { Show } from '../types';

interface SearchInputProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  suggestions: {name: string}[];
  onSelectShow: (showName: string) => void;
}

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, onSearchTermChange, suggestions, onSelectShow }) => {
  return (
    <div className="relative w-full">
      <div className="relative">
         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
            <SearchIcon />
        </span>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search for a TV show..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-300"
        />
      </div>
      {searchTerm && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg max-h-60 overflow-y-auto">
          {suggestions.map((show) => (
            <li
              key={show.name}
              onClick={() => onSelectShow(show.name)}
              className="px-4 py-2 cursor-pointer hover:bg-purple-500/20 transition duration-150"
            >
              {show.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;