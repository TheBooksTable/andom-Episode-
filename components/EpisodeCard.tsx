import React, { useMemo } from 'react';
import type { FormattedEpisode } from '../types';

interface EpisodeCardProps {
  episode: FormattedEpisode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const formattedAirdate = useMemo(() => {
    if (!episode.airdate) return null;
    try {
      return new Date(episode.airdate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return episode.airdate; // Fallback to original string if formatting fails
    }
  }, [episode.airdate]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img 
            className="h-48 w-full object-cover md:h-full md:w-48" 
            src={episode.image} 
            alt={episode.name} 
          />
        </div>
        <div className="p-6 md:p-8">
          <div className="uppercase tracking-wide text-sm text-purple-400 font-semibold">
            {episode.showName} &bull; S{episode.season.toString().padStart(2, '0')}E{episode.number.toString().padStart(2, '0')}
          </div>
          {formattedAirdate && (
            <p className="text-xs text-white/60 mt-1">Aired: {formattedAirdate}</p>
          )}
          <h2 className="block mt-2 text-2xl leading-tight font-bold text-white hover:text-purple-300 transition-colors duration-300">
            {episode.name}
          </h2>
          <p className="mt-4 text-white/80 max-h-32 overflow-y-auto">
            {episode.summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;