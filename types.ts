
export interface Show {
  id: number;
  name: string;
}

export interface ApiEpisode {
  id: number;
  name: string;
  season: number;
  number: number;
  summary: string | null;
  image: {
    medium: string;
    original: string;
  } | null;
}

export interface FormattedEpisode {
  id: number;
  name: string;
  season: number;
  number: number;
  summary: string;
  image: string;
  showName: string;
}
