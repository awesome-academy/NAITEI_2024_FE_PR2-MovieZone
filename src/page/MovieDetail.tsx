import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { fetchData } from "../services/fetchData";
import { Movie } from "../movie.type";
import { ReactComponent as AddToListIcon } from "../assets/icon/list.svg";
import { ReactComponent as FavoriteIcon } from "../assets/icon/heart.svg";
import { ReactComponent as WatchlistIcon } from "../assets/icon/bookmark.svg";
import { ReactComponent as FacebookIcon } from "../assets/icon/facebook.svg";
import { ReactComponent as TwitterIcon } from "../assets/icon/twitter.svg";
import { ReactComponent as InstagramIcon } from "../assets/icon/instagram.svg";
import Tooltip from "../component/Tooltip";
import MovieCarousel from "../component/MovieCarousel";
import MovieReviews from "../component/MovieReviews";

const MovieDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [movieOrTv, setMovieOrTv] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<{ [key: number]: string }>({});
  const location = useLocation();
  const isMoviePage = location.pathname.startsWith("/movie");

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

  return (
    <div className="text-white">
      <div
        className="relative w-full h-auto bg-cover bg-center"
        style={{
          backgroundImage: `url(${backdropImage})`
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex justify-between px-4 container max-w-screen-xl mx-auto">
          <div className="md:block hidden">
            <img
              src={posterImage}
              alt={isMoviePage ? movieOrTv.title : movieOrTv.name}
              className="w-[500px] rounded-lg shadow-lg my-8"
            />
          </div>
          <div className="md:pl-8 my-8">
            <h1 className="text-4xl font-bold">
              {isMoviePage ? movieOrTv.title : movieOrTv.name}
              {releaseYear && ` (${releaseYear})`}
            </h1>
            <div className="mt-2 text-lg">
              <span>{releaseDate ? new Date(releaseDate).toLocaleDateString() : '-'}</span> - 
              <span className="ml-2">{genreNames.join(', ')}</span>
            </div>

            <div className="mt-4 flex items-center">
              <div
                className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-gray-700 shadow-lg cursor-pointer"
              >
                <div
                  className="absolute inset-0 rounded-full border-4"
                  style={{
                    borderColor: movieOrTv.vote_average >= 8
                      ? "#4caf50"
                      : movieOrTv.vote_average >= 5
                      ? "#ffeb3b"
                      : "#f44336",
                    borderTopColor: "#e5e7eb",
                    transform: `rotate(${(Math.round(movieOrTv.vote_average * 10) / 100) * 360}deg)`,
                  }}
                />
                <span className="text-xl font-semibold text-white">
                  {Math.round(movieOrTv.vote_average * 10)}%
                </span>
              </div>
              <div className="ml-2 text-xl w-4">{t('MovieDetailPage.userScore')}</div>
            </div>


            <div className="mt-4 flex items-center space-x-6">
              <Tooltip text={t('MovieDetailPage.addList')} translateX="translate-x-[-20px]">
                <button className="relative w-10 h-10 flex items-center justify-center border-2 border-white rounded-full bg-black">
                  <AddToListIcon className="w-4 h-4 fill-white" />
                </button>
              </Tooltip>
              <Tooltip text={t('MovieDetailPage.favorite')} translateX="translate-x-[-38px]">
                <button className="relative w-10 h-10 flex items-center justify-center border-2 border-white rounded-full bg-black">
                  <FavoriteIcon className="w-4 h-4 fill-white" />
                </button>
              </Tooltip>
              <Tooltip text={t('MovieDetailPage.watchList')} translateX="translate-x-[-40px]">
                <button className="relative w-10 h-10 flex items-center justify-center border-2 border-white rounded-full bg-black">
                  <WatchlistIcon className="w-4 h-4 fill-white" />
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
                    {keyword.name}
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
