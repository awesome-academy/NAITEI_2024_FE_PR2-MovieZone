import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, Link } from 'react-router-dom';
import { fetchData } from "../services/fetchData";
import { Movie } from "../movie.type";
import { ReactComponent as AddToListIcon } from "../assets/icon/list.svg";
import { ReactComponent as FavoriteIcon } from "../assets/icon/heart.svg";
import { ReactComponent as WatchlistIcon } from "../assets/icon/bookmark.svg";
import { ReactComponent as FacebookIcon } from "../assets/icon/facebook.svg";
import { ReactComponent as TwitterIcon } from "../assets/icon/twitter.svg";
import { ReactComponent as InstagramIcon } from "../assets/icon/instagram.svg";
import { ReactComponent as TrashIcon } from "../assets/icon/trash.svg";
import { ReactComponent as CheckIcon } from "../assets/icon/check.svg";
import Tooltip from "../component/Tooltip";
import MovieCarousel from "../component/MovieCarousel";
import MovieReviews from "../component/MovieReviews";
import { useUserList } from '../context/UserListContext';
import useToggleVisibility from "../utils/useToggleVisibility";
import { useUser } from '../context/UserContext';

const MovieDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const [movieOrTv, setMovieOrTv] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const location = useLocation();
  const isMoviePage = location.pathname.startsWith("/movie");
  const { userLists, handleUserAction, setType } = useUserList();
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [newListName, setNewListName] = useState("");
  const { isOpen: showAddToList, toggle: handleAddToList, elementRef: refAddList } = useToggleVisibility();
  const { isOpen: showRatingSlider, toggle: handleRating, elementRef: refRating } = useToggleVisibility();
  const { userInfo } = useUser();

  useEffect(() => {
    if (userInfo) {
      const recentMoviesKey = `recentMovies_${userInfo.id}`;
      let storedRecentMovies = JSON.parse(localStorage.getItem(recentMoviesKey) || '[]');
  
      if (storedRecentMovies.includes(id)) {
        storedRecentMovies = storedRecentMovies.filter((movieId: string) => movieId !== id);
      }
  
      storedRecentMovies.unshift(id);
  
      if (storedRecentMovies.length > 15) {
        storedRecentMovies = storedRecentMovies.slice(0, 15);
      }
  
      localStorage.setItem(recentMoviesKey, JSON.stringify(storedRecentMovies));
    }
  }, [userInfo, id]);

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
    setType(isMoviePage ? "movie" : "tv");
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const endpoint = isMoviePage ? "movie" : "tv";
      const response = await fetchData(endpoint, `id=${id}`);
      
      setMovieOrTv(response.data[0]);

      const genresResponse = await fetchData(isMoviePage ? "movie_genres" : "tv_genres");
      const genresData = genresResponse.data.reduce((acc: { [key: number]: string }, genre: { id: number, name: string }) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
      setGenres(genresData);
    };

    fetchDetails();
  }, [id, isMoviePage]);

  if (!movieOrTv) {
    return <div className="text-4xl text-white text-center mt-10">{t('MovieDetailPage.notFound')}</div>;
  }

  const genreNames = movieOrTv.genre_ids?.map((genreId: number) => genres[genreId]) || [];
  const releaseDate = isMoviePage ? movieOrTv.release_date : movieOrTv.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  const backdropImage = movieOrTv.backdrop_path
    ? require(`../assets/image/${isMoviePage ? "movie" : "tv"}/backdrop${movieOrTv.backdrop_path}`)
    : null;

  const posterImage = movieOrTv.poster_path
    ? require(`../assets/image/${isMoviePage ? "movie" : "tv"}/poster${movieOrTv.poster_path}`)
    : null;

  const ratingColor = movieOrTv.vote_average >= 8
  ? "#4caf50"
  : movieOrTv.vote_average >= 5
  ? "#ffeb3b"
  : "#f44336"

  return (
    <div className="text-white">
      <div
        className="relative w-full h-auto bg-cover bg-center"
        style={{
          backgroundImage: `url(${backdropImage})`
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex px-4 container max-w-screen-xl mx-auto">
          <div className="md:block hidden">
            <img
              src={posterImage}
              alt={isMoviePage ? movieOrTv.title : movieOrTv.name}
              className="w-[300px] max-w-[300px] h-auto rounded-lg shadow-lg my-8 object-cover"
            />
          </div>
          <div className="md:pl-8 my-8">
            <h1 className="text-4xl font-bold">
              {isMoviePage ? movieOrTv.title : movieOrTv.name}
              {releaseYear && ` (${releaseYear})`}
            </h1>
            <div className="mt-2 text-lg">
              <span>{releaseDate ? new Date(releaseDate).toLocaleDateString() : '-'}</span> - 
              {genreNames.length > 0 && (
                <span>
                  {genreNames.map((genreName, index) => (
                    <Link
                      key={index}
                      to={`/movies?genre=${movieOrTv.genre_ids[index]}`}
                      className="ml-2 hover:text-blue-500"
                    >
                      {genreName}
                      {index < genreNames.length - 1 && ', '}
                    </Link>
                  ))}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center">
              <div
                className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-gray-700 shadow-lg cursor-pointer hover:scale-105 duration-200"
                onClick={handleRating}
              >
                <div
                  className="absolute inset-0 rounded-full border-4"
                  style={{
                    borderColor: ratingColor,
                    borderTopColor: "#e5e7eb",
                    transform: `rotate(${(Math.round(movieOrTv.vote_average * 10) / 100) * 360}deg)`,
                  }}
                />
                <span className={`text-xl font-semibold ${isInList('rating') ? `text-yellow-500` : 'text-white'}`}>
                  {Math.round(movieOrTv.vote_average * 10)}%
                </span>
              </div>
              <div className="ml-2 text-xl w-4">{t('MovieDetailPage.userScore')}</div>
              {showRatingSlider && (
                <div className="absolute translate-x-16 ml-1 w-64 bg-white shadow-lg rounded-lg px-4 py-2 space-x-2 flex justify-around" ref={refRating}>
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
            </div>

            <div className="mt-4 flex items-center space-x-6">
              <Tooltip text={t('MovieDetailPage.addList')}>
                <button
                  className="relative w-10 h-10 flex items-center justify-center border-2 border-white rounded-full bg-black"
                  onClick={handleAddToList}
                >
                  <AddToListIcon className={`w-4 h-4 fill-white ${isInList('addToList') ? 'fill-blue-500' : 'fill-white'}`} />
                </button>
              </Tooltip>
              {showAddToList && (
                <div className="absolute translate-x-6 ml-1 w-64 bg-white shadow-lg rounded-lg px-4 py-2 z-50 text-dark" ref={refAddList}>
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
              <Tooltip text={t('MovieDetailPage.favorite')}>
                <button
                  className="relative w-10 h-10 flex items-center justify-center border-2 border-white rounded-full bg-black"
                  onClick={() => handleAction('favorite', movieId)}
                >
                  <FavoriteIcon className={`w-4 h-4 ${isInList('favorite') ? 'fill-red-500' : 'fill-white'}`} />
                </button>
              </Tooltip>
              <Tooltip text={t('MovieDetailPage.watchList')}>
                <button
                  className="relative w-10 h-10 flex items-center justify-center border-2 border-white rounded-full bg-black"
                  onClick={() => handleAction('watchlist', movieId)}
                >
                  <WatchlistIcon className={`w-4 h-4 ${isInList('watchlist') ? 'fill-orange-500' : 'fill-white'}`} />
                </button>
              </Tooltip>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">{t('MovieDetailPage.overview')}</h2>
              <p>{movieOrTv.overview}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto flex md:flex-row flex-col-reverse">
        <div className="md:w-4/5">
          {movieOrTv.participants && movieOrTv.participants.length > 0 && (
            <div className="mt-6 px-4">
              <MovieCarousel 
                title={t('MovieDetailPage.participants')}
                data={movieOrTv.participants}
                type="participant"
              />
            </div>
          )}

          {movieOrTv.reviews && movieOrTv.reviews.length > 0 && (
            <MovieReviews reviews={movieOrTv.reviews}/>
          )}

          {movieOrTv.recommendations && movieOrTv.recommendations.length > 0 && (
            <div className="mt-6 px-4">
              <MovieCarousel 
                title={t('MovieDetailPage.recommendations')}
                data={movieOrTv.recommendations}
                style="horizontal"
              />
            </div>
          )}
        </div>

        <div className="md:w-1/5 px-4 space-y-4">
            <div className="flex items-center space-x-4 mt-10">
              {movieOrTv.medialink?.facebook && (
                <a href={movieOrTv.medialink.facebook}>
                  <FacebookIcon className="w-8 h-8 hover:scale-110 duration-200" />
                </a>
              )}
              {movieOrTv.medialink?.twitter && (
                <a href={movieOrTv.medialink.twitter}>
                  <TwitterIcon className="w-8 h-8 hover:scale-110 duration-200" />
                </a>
              )}
              {movieOrTv.medialink?.instagram && (
                <a href={movieOrTv.medialink.instagram}>
                  <InstagramIcon className="w-8 h-8 hover:scale-110 duration-200" />
                </a>
              )}
            </div>

          {movieOrTv.status && (
            <div>
              <h2 className="text-lg font-bold mb-2">{t('MovieDetailPage.status')}</h2>
              <p>{movieOrTv.status || '-'}</p>
            </div>
          )}
          {movieOrTv.budget && (
            <div>
              <h2 className="text-lg font-bold mb-2">{t('MovieDetailPage.budget')}</h2>
              <p>${movieOrTv.budget.toLocaleString() || '-'}</p>
            </div>
          )}
          {movieOrTv.status && (
            <div>
              <h2 className="text-lg font-bold mb-2">{t('MovieDetailPage.revenue')}</h2>
              <p>${movieOrTv.status.toLocaleString() || '-'}</p>
            </div>
          )}

          {movieOrTv.keywords && movieOrTv.keywords.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-2">{t('MovieDetailPage.keywords')}</h2>
              <ul className="list-none space-y-2">
                {movieOrTv.keywords.map((keyword) => (
                  <li 
                    key={keyword.id}
                    className="inline-block text-sm mr-2 bg-dark px-3 py-1 rounded-lg text-white cursor-pointer hover:scale-105 hover:bg-gray-700 duration-200">
                    <Link
                      to={`/search?query=${keyword.name}`}
                      className="bg-dark rounded-lg text-white cursor-pointer hover:scale-105 hover:bg-gray-700 duration-200"
                    >
                      {keyword.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
