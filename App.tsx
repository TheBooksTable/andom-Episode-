import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Show, FormattedEpisode, ApiEpisode } from './types';
import { SHOW_LIST } from './constants';
import { fetchShowId, fetchEpisodesForShow, selectRandomEpisode } from './services/tvmazeService';
import WaveBackground from './components/WaveBackground';
import SplashScreen from './components/SplashScreen';
import SearchInput from './components/SearchInput';
import SeasonSelector from './components/SeasonSelector';
import EpisodeCard from './components/EpisodeCard';
import LoadingSpinner from './components/LoadingSpinner';
import FavoritesSidebar from './components/FavoritesSidebar';

const App: React.FC = () => {
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(true);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [episodes, setEpisodes] = useState<ApiEpisode[]>([]);
    const [seasonInfo, setSeasonInfo] = useState({ min: 1, max: 1, total: 1 });
    const [seasonEpisodeCounts, setSeasonEpisodeCounts] = useState<{ season: number; count: number }[]>([]);
    const [randomEpisode, setRandomEpisode] = useState<FormattedEpisode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Show[]>([]);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setIsAppLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem('favoriteShows');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (e) {
            console.error("Failed to load favorites from localStorage", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('favoriteShows', JSON.stringify(favorites));
        } catch (e) {
            console.error("Failed to save favorites to localStorage", e);
        }
    }, [favorites]);

    const suggestions = useMemo(() => {
        if (!searchTerm) return [];
        return SHOW_LIST.filter(show =>
            show.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10);
    }, [searchTerm]);

    const isFavorite = useMemo(() => {
        return selectedShow ? favorites.some(fav => fav.id === selectedShow.id) : false;
    }, [selectedShow, favorites]);

    const handleSelectShow = useCallback(async (showName: string) => {
        setIsSearching(true);
        setError(null);
        setRandomEpisode(null);
        setSearchTerm(showName);
        setDropdownVisible(false);
        
        try {
            const showId = await fetchShowId(showName);
            if (!showId) throw new Error("Show not found.");

            const fetchedEpisodes = await fetchEpisodesForShow(showId);
            if (fetchedEpisodes.length === 0) throw new Error("Could not find episodes for this show.");
            
            const totalSeasons = Math.max(...fetchedEpisodes.map(ep => ep.season));
            
            const countsBySeason = fetchedEpisodes.reduce((acc, episode) => {
                acc[episode.season] = (acc[episode.season] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            const countsArray = Object.entries(countsBySeason).map(([season, count]) => ({
                season: Number(season),
                count: count,
            })).sort((a, b) => a.season - b.season);

            setSelectedShow({ id: showId, name: showName });
            setEpisodes(fetchedEpisodes);
            setSeasonEpisodeCounts(countsArray);
            setSeasonInfo({ min: 1, max: totalSeasons, total: totalSeasons });
        } catch (err: any) {
            setError(err.message);
            setSelectedShow(null);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleFindEpisode = useCallback(() => {
        if (!episodes || !selectedShow) return;
        setIsSearching(true);
        setError(null);
        setRandomEpisode(null);
        setTimeout(() => {
            const episode = selectRandomEpisode(episodes, seasonInfo.min, seasonInfo.max, selectedShow.name);
            if (episode) {
                setRandomEpisode(episode);
            } else {
                setError("No episodes found in the selected season range.");
            }
            setIsSearching(false);
        }, 500);
    }, [episodes, seasonInfo, selectedShow]);

    const handleSurpriseMe = useCallback(async () => {
        const randomShow = SHOW_LIST[Math.floor(Math.random() * SHOW_LIST.length)];
        await handleSelectShow(randomShow.name);
        // handleFindEpisode is triggered via useEffect when episodes state is set from handleSelectShow
    }, [handleSelectShow]);

    useEffect(() => {
        if (episodes.length > 0 && selectedShow && searchTerm === selectedShow.name) {
             // This condition prevents auto-finding when just typing a full show name
            handleFindEpisode();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [episodes, selectedShow]); // This effect should run specifically when episodes for a new show are loaded.

    const toggleFavorite = useCallback(() => {
        if (!selectedShow) return;
        setFavorites(prev => 
            isFavorite ? prev.filter(fav => fav.id !== selectedShow.id) : [...prev, selectedShow]
        );
    }, [selectedShow, isFavorite]);

    const handleRemoveFavorite = useCallback((showId: number) => {
        setFavorites(prev => prev.filter(fav => fav.id !== showId));
    }, []);

    const handleSelectFavorite = useCallback((show: Show) => {
        handleSelectShow(show.name);
        setIsFavoritesOpen(false);
    }, [handleSelectShow]);


    const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
    );

    const MenuIcon: React.FC = () => (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
         </svg>
    );

    return (
        <>
            <SplashScreen isVisible={isAppLoading} />
            <WaveBackground />
            <FavoritesSidebar 
                favorites={favorites} 
                onSelectFavorite={handleSelectFavorite}
                onRemoveFavorite={handleRemoveFavorite}
                isOpen={isFavoritesOpen}
                onClose={() => setIsFavoritesOpen(false)}
            />
            <main className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center relative z-10 lg:ml-80">
                <button onClick={() => setIsFavoritesOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-black/30 backdrop-blur-md rounded-full text-white">
                    <MenuIcon />
                </button>
                <div className="w-full max-w-2xl mx-auto space-y-6 p-6 sm:p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-500">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 pb-2">
                        Random Episode Finder
                    </h1>

                    <SearchInput
                        searchTerm={searchTerm}
                        onSearchTermChange={(term) => {
                            setSearchTerm(term);
                            setDropdownVisible(true);
                            if (!term) {
                                setSelectedShow(null);
                                setRandomEpisode(null);
                                setEpisodes([]);
                                setSeasonEpisodeCounts([]);
                            }
                        }}
                        suggestions={suggestions}
                        onSelectShow={handleSelectShow}
                        dropdownVisible={dropdownVisible}
                    />

                    {selectedShow && (
                        <div className="animate-fade-in space-y-6">
                            <SeasonSelector
                                totalSeasons={seasonInfo.total}
                                minSeason={seasonInfo.min}
                                maxSeason={seasonInfo.max}
                                onSeasonChange={(min, max) => setSeasonInfo(prev => ({ ...prev, min, max }))}
                                seasonEpisodeCounts={seasonEpisodeCounts}
                            />
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <button
                                    onClick={handleFindEpisode}
                                    disabled={isSearching}
                                    className="w-full sm:w-auto flex-grow px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Find Random Episode
                                </button>
                                <button 
                                    onClick={toggleFavorite} 
                                    className={`p-3 rounded-lg transition-colors duration-300 ${isFavorite ? 'text-pink-500 bg-pink-500/20' : 'text-white/70 bg-white/10 hover:bg-white/20'}`}
                                    aria-label="Toggle Favorite"
                                >
                                    <HeartIcon filled={isFavorite} />
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={handleSurpriseMe}
                        disabled={isSearching}
                        className="w-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg shadow-lg hover:scale-105 hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ✨ Surprise Me!
                    </button>
                </div>
                
                <div className="w-full mt-8">
                    {isSearching && <LoadingSpinner />}
                    {error && <p className="text-center text-red-400 bg-red-500/20 p-3 rounded-lg">{error}</p>}
                    {randomEpisode && <EpisodeCard episode={randomEpisode} />}
                </div>
            </main>
        </>
    );
};

export default App;