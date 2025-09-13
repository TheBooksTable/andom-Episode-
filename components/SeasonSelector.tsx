import React from 'react';

interface SeasonSelectorProps {
  totalSeasons: number;
  minSeason: number;
  maxSeason: number;
  onSeasonChange: (min: number, max: number) => void;
  seasonEpisodeCounts: { season: number; count: number }[];
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ totalSeasons, minSeason, maxSeason, onSeasonChange, seasonEpisodeCounts }) => {
  if (totalSeasons <= 1) return null;

  const handleMinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMin = Math.min(Number(e.target.value), maxSeason);
    onSeasonChange(newMin, maxSeason);
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMax = Math.max(Number(e.target.value), minSeason);
    onSeasonChange(minSeason, newMax);
  };

  const selectStyles = `
    w-full pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg 
    focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-300
    appearance-none
    bg-no-repeat
    bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]
    bg-right
    bg-origin-content
    bg-[length:1.5em_1.5em]
  `;

  return (
    <div className="w-full space-y-4 animate-fade-in">
        <div className="text-center font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 mb-2">
            Season Range
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium text-white/80 mb-1">
                    From Season
                </label>
                <select
                    value={minSeason}
                    onChange={handleMinChange}
                    className={selectStyles}
                >
                    {seasonEpisodeCounts.map(({ season, count }) => (
                        <option key={`min-${season}`} value={season} className="bg-[#0e0e2e]">
                            Season {season} ({count} {count === 1 ? 'episode' : 'episodes'})
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium text-white/80 mb-1">
                    To Season
                </label>
                <select
                    value={maxSeason}
                    onChange={handleMaxChange}
                    className={selectStyles}
                >
                    {seasonEpisodeCounts.map(({ season, count }) => (
                        <option key={`max-${season}`} value={season} className="bg-[#0e0e2e]">
                            Season {season} ({count} {count === 1 ? 'episode' : 'episodes'})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    </div>
  );
};

export default SeasonSelector;