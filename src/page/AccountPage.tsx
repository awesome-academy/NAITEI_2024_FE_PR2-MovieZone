import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate  } from 'react-router-dom';
import { useUserList } from '../context/UserListContext';
import MovieCard from "../component/MovieCard";
import { fetchData, deleteUser, updateUser } from "../services/fetchData";
import { Movie } from "../movie.type";
import { ReactComponent as BackIcon } from "../assets/icon/back.svg";
import { ReactComponent as CloseIcon } from "../assets/icon/close.svg";
import { ReactComponent as PlusIcon } from "../assets/icon/plus.svg";
import { ReactComponent as CheckIcon } from "../assets/icon/check.svg";
import { ReactComponent as EditIcon } from "../assets/icon/edit.svg";
import useToggleVisibility from "../utils/useToggleVisibility";
import { useAlert } from '../context/AlertContext';
import { useUser } from '../context/UserContext';

const AccountPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation(); 
  const navigate = useNavigate();
  const { userLists, handleUserAction, setType } = useUserList();
  const { userInfo, setUserInfo } = useUser();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSubTab, setSelectedSubTab] = useState<'movie' | 'tv'>('movie');
  const [data, setData] = useState<Movie[]>([]);
  const [selectedListName, setSelectedListName] = useState<string | null>(null);
  const [listName, setListName] = useState("");
  const { isOpen, toggle, elementRef } = useToggleVisibility();
  const { setAlert } = useAlert();
  const [username, setUsername] = useState(userInfo?.username || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (userInfo === null) {
      navigate('/login'); 
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchTabData = async (type: 'movie' | 'tv') => {
      const endpoint = type === 'movie' ? 'movie' : 'tv';
      const fetchedData = await fetchData(endpoint);
      setData(fetchedData.data);
      setType(type);
    };

    fetchTabData(selectedSubTab);
  }, [selectedSubTab, setType, location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/account/watchlist')) {
      setSelectedTab('watchlist');
    } else if (path.includes('/account/favorite')) {
      setSelectedTab('favorite');
    } else if (path.includes('/account/rating')) {
      setSelectedTab('rating');
    } else if (path.includes('/account/list')) {
      setSelectedTab('addToList');
    } else {
      setSelectedTab('overview');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setSelectedListName(null);
    handleSubTabChange('movie')

    switch(tab) {
      case 'watchlist':
        navigate('/account/watchlist');
        break;
      case 'favorite':
        navigate('/account/favorite');
        break;
      case 'rating':
        navigate('/account/rating');
        break;
      case 'addToList':
        navigate('/account/list');
        break;
      default:
        navigate('/account');
    }
  };

  const handleSubTabChange = (subTab: 'movie' | 'tv') => {
    setSelectedSubTab(subTab);
  };

  const handleListChange = (listName: string) => {
    const selectedList = userLists.addToList[listName];
    if (Array.isArray(selectedList)) {
      setSelectedListName(listName);
    } else {
      setSelectedListName(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userInfo) return;

    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    await deleteUser(Number(userInfo.id));
    setAlert({ message: t("PersonDetailPage.deletededAlert"), type: "info" });
    sessionStorage.removeItem("user");
    setUserInfo(null);
    navigate("/login");
  };

  const validateInputs = () => {
    if (username.length <= 5) {
      setAlert({ message: t("authPage.usernameTooShort"), type: "error" });
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setAlert({ message: t("authPage.invalidEmail"), type: "error" });
      return false;
    }

    return true;
  };

  const handleUpdateAccount = async () => {
    if (!userInfo) return;

    if (!validateInputs()) {
      return;
    }

    const updatedUser = await updateUser(Number(userInfo.id), { username, email });
    setUserInfo(updatedUser);
    setAlert({ message: t("PersonDetailPage.updatedAlert"), type: "success" });
    setEditMode(false);
  };

  const getTabContent = () => {
    let content;

    if (selectedTab === 'overview') {
      const totalRatings = Object.keys(userLists.rating).length;
      const totalList = Object.keys(userLists.addToList).length;
      const totalFavorites = userLists.favorite.length;
      const totalWatchlist = userLists.watchlist.length;

      return (
        <div className="px-4">
          <h1 className="text-2xl px-10 mb-3 font-semibold">{t('AccountPage.stats')}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="md:text-2xl text-lg mb-4">{t('AccountPage.totalFavorite')}</h3>
              <p className="text-5xl text-primary font-bold">{totalFavorites}</p>
            </div>
            <div className="text-center">
              <h3 className="md:text-2xl text-lg mb-4">{t('AccountPage.totalList')}</h3>
              <p className="text-5xl text-primary font-bold">{totalList}</p>
            </div>
            <div className="text-center">
              <h3 className="md:text-2xl text-lg mb-4">{t('AccountPage.totalRatings')}</h3>
              <p className="text-5xl text-primary font-bold">{totalRatings}</p>
            </div>
            <div className="text-center">
              <h3 className="md:text-2xl text-lg mb-4">{t('AccountPage.totalWatchlist')}</h3>
              <p className="text-5xl text-primary font-bold">{totalWatchlist}</p>
            </div>
          </div>
        </div>
      );
    } else if (selectedTab === 'addToList') {
      if (selectedListName === null) {
        content = (
          <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
            {Object.keys(userLists.addToList).map((listName) => (
              <button
                key={listName}
                onClick={() => handleListChange(listName)}
                className="hover:bg-primary text-white px-4 py-2 rounded mb-2 h-48 border-2 border-white"
              >
                {listName}
              </button>
            ))}
          </div>
        );
      } else {
        const selectedListId = userLists.addToList[selectedListName] || [];
        if (selectedListId.length === 0) {
          content = <p className="text-center text-xl">{t('AccountPage.noFound')}</p>;
        } else {
          content = selectedListId.map((movieId: number) => {
            const movie = data.find((movieItem: Movie) => movieItem.id === movieId);
            if (!movie) return null;
    
            return (
              <div className="px-4" key={movieId}>
                <MovieCard movie={movie} style="flex" />
              </div>
            );
          });
        }
      }
    } else {
      let selectedListId: number[] = [];

      if (selectedTab === 'favorite') {
        selectedListId = userLists.favorite;
      } else if (selectedTab === 'watchlist') {
        selectedListId = userLists.watchlist;
      } else {
        selectedListId = Object.keys(userLists.rating).map(key => parseInt(key));
      }

      if (selectedListId.length === 0) {
        content = <p className="text-center text-xl">{t('AccountPage.noFound')}</p>;
      } else {
        content = selectedListId.map((movieId: number) => {
          const movie = data.find((movieItem: Movie) => movieItem.id === movieId);
          if (!movie) return null;
  
          return (
            <div className="px-4" key={movieId}>
              <MovieCard movie={movie} style="flex" />
            </div>
          );
        });
      }
    }

    return content;
  };

  return (
    <div className="text-white">
      <div className="relative w-full bg-gray-800 min-h-[300px] flex items-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 container max-w-screen-xl mx-auto px-4">
          <div className="flex md:flex-row flex-col md:tems-center md:space-x-4 space-y-1 md:space-y-0">
            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer mt-2">
              {userInfo?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                {editMode ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-4xl font-bold border-b border-gray-300 w-[300px] bg-gray-800 focus:outline-none text-white"
                  />
                ) : (
                  <h1 className="text-4xl font-bold">{userInfo?.username}</h1>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-1">
                {editMode ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xl font-bold border-b border-gray-300 bg-gray-800 focus:outline-none text-white"
                  />
                ) : (
                  <h1 className="text-xl font-bold">{userInfo?.email}</h1>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {editMode ? (
                  <>
                    <button
                      onClick={handleUpdateAccount}
                      className="text-green-500 hover:text-green-700"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setUsername(userInfo?.username || "");
                        setEmail(userInfo?.email || "");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <CloseIcon className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <EditIcon className="w-5 h-5 fill-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        <div className="mt-6 ml-auto">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700"
              >
                {t("PersonDetailPage.deleteAccount")}
              </button>
            </div>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto flex justify-center items-center">
        <div
          onClick={() => handleTabChange('overview')}
          className={`${selectedTab === 'overview' ? 'bg-primary' : 'cursor-pointer hover:bg-primary'} py-2 px-3`}
        >
          {t('AccountPage.overview')}
        </div>
        <div
          onClick={() => handleTabChange('favorite')}
          className={`${selectedTab === 'favorite' ? 'bg-primary' : 'cursor-pointer hover:bg-primary'} py-2 px-3`}
        >
          {t('AccountPage.favorite')}
        </div>
        <div
          onClick={() => handleTabChange('addToList')}
          className={`${selectedTab === 'addToList' ? 'bg-primary' : 'cursor-pointer hover:bg-primary'} py-2 px-3`}
        >
          {t('AccountPage.list')}
        </div>
        <div 
          onClick={() => handleTabChange('rating')}
          className={`${selectedTab === 'rating' ? 'bg-primary' : 'cursor-pointer hover:bg-primary'} py-2 px-3`}
        >
          {t('AccountPage.rating')}
        </div>
        <div
          onClick={() => handleTabChange('watchlist')}
          className={`${selectedTab === 'watchlist' ? 'bg-primary' : 'cursor-pointer hover:bg-primary'} py-2 px-3`}
        >
          {t('AccountPage.watchlist')}
        </div>
      </div>
      <hr />
      <div className="container max-w-screen-xl mx-auto p-4 space-y-3">
        <div className="flex">
          <div className="text-3xl font-semibold px-3 mr-5">
          {
            selectedTab === 'favorite' 
            ? t('AccountPage.favorite')
            : selectedTab === 'addToList' 
            ? t('AccountPage.list')
            : selectedTab === 'rating' 
            ? t('AccountPage.rating')
            : selectedTab === 'watchlist' 
            ? t('AccountPage.watchlist')
            : selectedTab === 'overview' 
            ? t('AccountPage.overview')
            : null
          }
          </div>
          <div className="flex items-center">
            <div
              onClick={() => handleSubTabChange('movie')}
              className={`${selectedSubTab === 'movie' ? 'border-primary' : 'cursor-pointer hover:border-primary border-transparent'} border-b-4 py-2 px-3`}
            >{
              t('AccountPage.movie')}
            </div>
            <div
              onClick={() => handleSubTabChange('tv')}
              className={`${selectedSubTab === 'tv' ? 'border-primary' : 'cursor-pointer hover:border-primary border-transparent'} border-b-4 py-2 px-3`}
            >
              {t('AccountPage.tvShow')}
            </div>
          </div>
          {selectedListName !== null && (
            <div className="ml-auto flex space-x-2 mt-2">
              <div 
                onClick={() => setSelectedListName(null)} 
                className="group cursor-pointer flex items-center justify-center hover:bg-red-500 bg-white rounded-full w-8 h-8 p-2 duration-200"
              >
                <BackIcon className="w-4 h-4 fill-red-500 group-hover:fill-white" />
              </div>
              <div 
                onClick={() => {
                  handleUserAction("removeListName", 0, undefined, selectedListName);
                  setSelectedListName(null);
                }} 
                className="group cursor-pointer flex items-center justify-center bg-primary hover:bg-red-500 rounded-full w-8 h-8 p-2 duration-200"
              >
                <CloseIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
          {selectedTab === "addToList" && selectedListName === null && (
            <div className="ml-auto flex space-x-2 mt-2 relative">
              <div 
                onClick={toggle} 
                className="group cursor-pointer flex items-center justify-center hover:bg-red-500 bg-white rounded-full w-8 h-8 p-2 duration-200"
              >
                <PlusIcon className="w-4 h-4 fill-red-500 group-hover:fill-white" />
              </div>
              {isOpen && (
                <div className="absolute right-0 bg-white p-4 flex max-w-xs shadow-lg rounded-md space-x-2" ref={elementRef}>
                  <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name"
                    className="p-2 border rounded-md w-32 bg-gray-200 text-dark"
                  />
                  <button
                    onClick={() => {
                      handleUserAction("createList", 0, undefined, listName);
                      setListName("");
                    }}
                    className="bg-primary text-white p-2 rounded-md text-lg"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {getTabContent()}
      </div>
    </div>
  );
};

export default AccountPage;
