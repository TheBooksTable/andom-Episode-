import React from 'react';
import type { Show } from '../types';

interface FavoritesSidebarProps {
  favorites: Show[];
  onSelectFavorite: (show: Show) => void;
  onRemoveFavorite: (showId: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const StarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 hover:text-red-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const FavoritesSidebar: React.FC<FavoritesSidebarProps> = ({ favorites, onSelectFavorite, onRemoveFavorite, isOpen, onClose }) => {
  const sidebarClasses = `
    fixed top-0 h-full z-30 transition-transform duration-300 ease-in-out
    bg-white/5 backdrop-blur-2xl border-r border-white/10
    w-72 md:w-80 p-6 flex flex-col
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:left-0
  `;

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-20 lg:hidden"></div>}
      <aside className={sidebarClasses}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
            <StarIcon/> Favorites
          </h2>
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        
        {favorites.length > 0 ? (
          <ul className="space-y-3 overflow-y-auto flex-grow">
            {favorites.map(show => (
              <li key={show.id} className="group flex items-center justify-between p-3 bg-white/5 rounded-lg transition-all duration-200 hover:bg-white/10 hover:shadow-lg">
                <span 
                  onClick={() => onSelectFavorite(show)}
                  className="cursor-pointer font-medium truncate"
                >
                  {show.name}
                </span>
                <button onClick={() => onRemoveFavorite(show.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex-grow flex items-center justify-center text-center text-white/50">
            <p>Your favorite shows will appear here. Add one to get started!</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default FavoritesSidebar;