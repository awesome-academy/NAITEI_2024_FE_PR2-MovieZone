import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { MovieMenuProps } from "../movie.type";
import { ReactComponent as ListIcon } from "../assets/icon/list.svg";
import { ReactComponent as HeartIcon } from "../assets/icon/heart.svg";
import { ReactComponent as BookmarkIcon } from "../assets/icon/bookmark.svg";
import { ReactComponent as StarIcon } from "../assets/icon/star.svg";
import { ReactComponent as EllipsisIcon } from "../assets/icon/ellipsis.svg";
import { ReactComponent as TrashIcon } from "../assets/icon/trash.svg";
import { ReactComponent as CheckIcon } from "../assets/icon/check.svg";
import { useUserList } from '../context/UserListContext';

const MovieMenu: React.FC<MovieMenuProps> = ({ isOpen, toggleMenu, position="right", movieId, type }) => {
  const { t } = useTranslation();
  const { userLists, handleUserAction, setType } = useUserList();
  const [showRatingSlider, setShowRatingSlider] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [showAddToList, setShowAddToList] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleRating = () => {
    setShowRatingSlider(!showRatingSlider);
  };

  const handleAddToList = () => {
    setShowAddToList(!showAddToList);
  };

  const isInList = (listKey: 'addToList' | 'favorite' | 'watchlist' | 'rating') => {
    if (listKey === 'addToList') {
      for (const listName in userLists.addToList) {
        const list = userLists.addToList[listName];
        if (list.includes(movieId)) {
          return true;
        }
      }
      return false;
    }

    if (listKey === 'rating') {
      return movieId in userLists.rating;
    }

    return userLists[listKey].includes(movieId);
  };

  const handleAction = (key: string, movieId: number, rating?: number | null, listName?: string) => {
    if (key === 'rating' && rating !== null) {
      handleUserAction(key, movieId, rating);
    } else if (key === 'addToList' && listName) {
      handleUserAction(key, movieId, undefined, listName);
    } else if (key === 'createList' && newListName) {
      handleUserAction(key, movieId, undefined, newListName);
      setNewListName('');
    } else if (key === 'removeList' && listName) {
      handleUserAction(key, movieId, undefined, listName);
    } else {
      handleUserAction(key, movieId);
    }
  };

  useEffect(() => {
    setCurrentRating(userLists.rating[movieId] || null);
    setType(type);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => {
          toggleMenu();
          setShowRatingSlider(false);
          setShowAddToList(false);
        }}
        className="p-1 rounded-full bg-gray-100 opacity-60 text-white hover:bg-gray-500 focus:outline-none"
      >
        <EllipsisIcon className="w-5 h-5" />
      </button>

      <div
        className={`absolute ${position === "right" ? "right-0" : "left-0"} mt-2 w-auto max-w-xs bg-white shadow-lg rounded-lg z-10 transition-all duration-300 transform origin-top ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
      >
        <ul className="text-sm text-gray-700">
          <li 
            className="px-4 py-2 cursor-pointer flex items-center gap-2 group whitespace-nowrap rounded-t-lg hover:bg-primary hover:text-white"
            onClick={() => {
              handleAddToList();
              setShowRatingSlider(false);
            }}
          >
            <ListIcon className={`w-5 h-5 ${isInList('addToList') ? 'fill-blue-500' : 'fill-black group-hover:fill-white'}`} />
            {t('home.addToList')}
          </li>

          {showAddToList && (
            <div className="absolute left-full top-0 ml-1 w-64 bg-white shadow-lg rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 mt-2">
                <select
                  onChange={(e) => handleAction('addToList', movieId, undefined, e.target.value)}
                  className="w-full p-2 border rounded"
                  value={
                    Object.keys(userLists.addToList).find(listName => 
                      userLists.addToList[listName].includes(movieId)
                    ) || ''
                  }
                >
                  <option value="" disabled selected>{t('home.selectList')}</option>
                  {Object.keys(userLists.addToList).map((listName) => (
                    <option key={listName} value={listName}>
                      {listName}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => handleAction('removeList', movieId)}
                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder={t('home.createNewList')}
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => {
                    if (newListName) handleAction('createList', movieId, undefined, newListName);
                  }}
                  className="p-2 bg-green-600 hover:bg-green-500 text-white rounded"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <li
            className="px-4 py-2 cursor-pointer flex items-center gap-2 group whitespace-nowrap hover:bg-primary hover:text-white"
            onClick={() => handleAction('favorite', movieId)}
          >
            <HeartIcon className={`w-5 h-5 ${isInList('favorite') ? 'fill-red-500' : 'fill-black group-hover:fill-white'}`} /> {t('home.favorite')}
          </li>
          <li
            className="px-4 py-2 cursor-pointer flex items-center gap-2 group whitespace-nowrap hover:bg-primary hover:text-white"
            onClick={() => handleAction('watchlist', movieId)}
          >
            <BookmarkIcon className={`w-5 h-5 ${isInList('watchlist') ? 'fill-orange-500' : 'fill-black group-hover:fill-white'}`} /> {t('home.watchlist')}
          </li>
          <li
            className="px-4 py-2 cursor-pointer flex items-center gap-2 group whitespace-nowrap rounded-b-lg hover:bg-primary hover:text-white"
            onClick={() => {
              handleRating();
              setShowAddToList(false);
            }}
          >
            <StarIcon className={`w-5 h-5 ${isInList('rating') ? 'fill-yellow-500' : 'fill-black group-hover:fill-white'}`} /> {t('home.rating2')}
          </li>
          {showRatingSlider && (
            <div className="absolute left-full bottom-0 ml-1 w-64 bg-white shadow-lg rounded-lg px-4 py-2 space-x-2 flex justify-around">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={currentRating ?? 0}
                onChange={(e) => setCurrentRating(parseFloat(e.target.value))}
                className="w-1/2"
              />
              <span className="text-gray-700 font-semibold w-6 text-center flex items-center">{currentRating?.toFixed(1) ?? "0.0"}</span>
              <button onClick={() => handleAction("rating", movieId, currentRating)} className="p-2 bg-green-600 hover:bg-green-500 text-white rounded">
                <CheckIcon className="w-4 h-4" />
              </button>
              <button onClick={() => handleAction('rating', movieId, undefined)} className="p-2 bg-red-600 hover:bg-red-500 text-white rounded">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MovieMenu;
