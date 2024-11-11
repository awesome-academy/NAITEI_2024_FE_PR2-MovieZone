import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAlert } from '../context/AlertContext';
import { useTranslation } from 'react-i18next';
import { UserLists, UserInfo } from "../movie.type";
import { fetchUserLists, saveUserLists } from '../services/fetchData';
import { useUser } from '../context/UserContext';

interface UserListContextProps {
  userLists: UserLists;
  handleUserAction: (key: string, movieId: number, rating?: number, listName?: string) => void;
  setType: (type: "movie" | "tv") => void;
  userInfo: UserInfo | null;
}

const UserListContext = createContext<UserListContextProps | undefined>(undefined);

export const UserListProvider: React.FC<{ children: ReactNode, currentLocation: string; }> = ({ children, currentLocation }) => {
  const { t } = useTranslation();
  const { setAlert } = useAlert();
  const { userInfo } = useUser();

  const defaultUserLists: UserLists = {
    addToList: {},
    favorite: [],
    watchlist: [],
    rating: {}
  };
  const [userLists, setUserLists] = useState<UserLists>(defaultUserLists);
  const [type, setType] = useState<"movie" | "tv">("movie");

  useEffect(() => {
    const noShouldFetchData = ["/person"].includes(currentLocation);

    if (!noShouldFetchData) {
      const fetchUserData = async () => {
        if (!userInfo) {
          return;
        }

        try {
          const userListsData = await fetchUserLists(Number(userInfo.id), type);
          setUserLists(userListsData);
        } catch (error) {
          setUserLists(defaultUserLists);
          await saveUserLists(Number(userInfo.id), type, defaultUserLists);
        }
      };

      fetchUserData();
    }
  }, [type, currentLocation, userInfo]);

  const handleUserAction = (key: string, movieId: number, rating?: number, listName?: string) => {
    if (!userInfo) {
      setAlert({ message: t('home.loginAlert'), type: 'warning' });
      return;
    }

    const updatedLists = { ...userLists };

    if (key === 'createList' && listName) {
      if (updatedLists.addToList[listName]) {
        setAlert({ message: t('home.listExistsAlert'), type: 'warning' });
      } else {
        updatedLists.addToList[listName] = [];
        setAlert({ message: t('home.createListAlert'), type: 'success' });
      }
    } else if (key === 'addToList' && listName) {
      Object.keys(updatedLists.addToList).forEach(lName => {
        const list = updatedLists.addToList[lName];
        const index = list.indexOf(movieId);
        if (index > -1 && lName !== listName) list.splice(index, 1);
      });
      updatedLists.addToList[listName].push(movieId);
      setAlert({ message: t('home.addToListAlert'), type: 'success' });
    } else if (key === 'favorite' || key === 'watchlist') {
      const list = updatedLists[key];
      const index = list.indexOf(movieId);
      if (index > -1) {
        list.splice(index, 1);
        setAlert({ message: key === 'favorite' ? t('home.removeFavoriteAlert') : t('home.removeWatchlistAlert'), type: 'info' });
      } else {
        list.push(movieId);
        setAlert({ message: key === 'favorite' ? t('home.favoriteAlert') : t('home.watchlistAlert'), type: 'success' });
      }
    } else if (key === 'rating') {
      if (rating === undefined) {
        delete updatedLists.rating[movieId];
        setAlert({ message: t('home.removeRatingAlert'), type: 'info' });
      } else {
        updatedLists.rating[movieId] = rating;
        setAlert({ message: t('home.ratingAlert'), type: 'success' });
      }
    } else if (key === 'removeList') {
      let movieFound = false;
      Object.keys(updatedLists.addToList).forEach(lName => {
        const list = updatedLists.addToList[lName];
        const index = list.indexOf(movieId);
        if (index > -1) {
          list.splice(index, 1);
          movieFound = true;
        }
      });
      setAlert({ message: movieFound ? t('home.removeListAlert') : t('home.movieNotInAnyListAlert'), type: 'info' });
    } else if (key === 'removeListName' && listName) {
      if (updatedLists.addToList[listName]) {
        delete updatedLists.addToList[listName];
        setAlert({ message: t('home.removeListNameAlert'), type: 'info' });
      } else {
        setAlert({ message: t('home.listNotFoundAlert'), type: 'warning' });
      }
    }

    setUserLists(updatedLists);
    if (userInfo) {
      saveUserLists(Number(userInfo.id), type, updatedLists)
        .catch(error => console.error("Error saving user data", error));
    }
  };

  return (
    <UserListContext.Provider value={{ userLists, handleUserAction, setType, userInfo }}>
      {children}
    </UserListContext.Provider>
  );
};

export const useUserList = () => {
  const context = useContext(UserListContext);
  if (!context) {
    throw new Error('useUserList must be used within a UserListProvider');
  }
  return context;
};
