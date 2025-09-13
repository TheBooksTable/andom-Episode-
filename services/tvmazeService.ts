
import type { ApiEpisode, FormattedEpisode, Show } from '../types';

const API_BASE_URL = 'https://api.tvmaze.com';
const episodeCache = new Map<number, ApiEpisode[]>();

const stripHtml = (html: string | null): string => {
  if (!html) return 'No summary available.';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || 'No summary available.';
};

export const fetchShowId = async (showName: string): Promise<number | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/singlesearch/shows?q=${encodeURIComponent(showName)}`);
    if (!response.ok) {
      throw new Error('Show not found');
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error fetching show ID:', error);
    return null;
  }
};

export const fetchEpisodesForShow = async (showId: number): Promise<ApiEpisode[]> => {
  if (episodeCache.has(showId)) {
    return episodeCache.get(showId)!;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/shows/${showId}/episodes`);
    if (!response.ok) {
      throw new Error('Could not fetch episodes');
    }
    const data: ApiEpisode[] = await response.json();
    episodeCache.set(showId, data);
    return data;
  } catch (error) {
    console.error(`Error fetching episodes for show ID ${showId}:`, error);
    return [];
  }
};

export const selectRandomEpisode = (
  episodes: ApiEpisode[],
  minSeason: number,
  maxSeason: number,
  showName: string
): FormattedEpisode | null => {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  const filteredEpisodes = episodes.filter(
    (ep) => ep.season >= minSeason && ep.season <= maxSeason
  );

  if (filteredEpisodes.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredEpisodes.length);
  const randomRawEpisode = filteredEpisodes[randomIndex];

  return {
    id: randomRawEpisode.id,
    name: randomRawEpisode.name,
    season: randomRawEpisode.season,
    number: randomRawEpisode.number,
    summary: stripHtml(randomRawEpisode.summary),
    image: randomRawEpisode.image?.original || `https://picsum.photos/seed/${randomRawEpisode.id}/1280/720`,
    showName: showName,
  };
};
