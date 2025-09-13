
import React from 'react';

interface SeasonSelectorProps {
  totalSeasons: number;
  minSeason: number;
  maxSeason: number;
  onSeasonChange: (min: number, max: number) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ totalSeasons, minSeason, maxSeason, onSeasonChange }) => {
  if (totalSeasons <= 1) return null;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxSeason);
    onSeasonChange(newMin, maxSeason);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minSeason);
    onSeasonChange(minSeason, newMax);
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
        <div className="text-center font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 mb-2">
            Season Range
        </div>
        <div className="space-y-2">
            <label className="flex justify-between text-sm font-medium text-white/80">
                <span>From Season</span>
                <span className="font-bold text-purple-300">{minSeason}</span>
            </label>
            <input
                type="range"
                min="1"
                max={totalSeasons}
                value={minSeason}
                onChange={handleMinChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
        </div>
        <div className="space-y-2">
            <label className="flex justify-between text-sm font-medium text-white/80">
                <span>To Season</span>
                 <span className="font-bold text-purple-300">{maxSeason}</span>
            </label>
            <input
                type="range"
                min="1"
                max={totalSeasons}
                value={maxSeason}
                onChange={handleMaxChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
        </div>
    </div>
  );
};

export default SeasonSelector;
