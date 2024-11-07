import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { MovieModalProps } from "../movie.type";
import Close from "../assets/icon/close.svg";
import MovieMenu from "./MovieMenu";
import Tooltip from "./Tooltip";

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { t } = useTranslation();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-dark bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-charcoal rounded-lg shadow-lg md:max-w-xl w-full relative overflow-hidden">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-lg">
          <img src={Close} alt="Close icon" />
        </button>
        <div className="flex">
          <img
            src={require(`../assets/image/movie/poster${movie.poster_path}`)}
            alt={movie.title}
            className="w-1/3 object-cover"
          />
          <div className="p-4 w-2/3">
            <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
            <p className="text-gray-400 mb-2">{movie.release_date}</p>
            <Tooltip text={movie.overview} width={'md:w-[350px] w-[200px]'}>
              <p className="text-gray-200 md:text-sm text-xs line-clamp-4">{movie.overview}</p>
            </Tooltip>
            <div className="mt-4 flex items-center">
              <span className="text-yellow-400 font-bold text-lg">{movie.vote_average.toFixed(1)} </span>/10
            </div>
            <Link to={`/movie/${movie.id}`}>
              <button className="mt-4 inline-block bg-primary text-white rounded px-4 py-2 hover:bg-red-800 transition">
                {t('home.viewDetails')}
              </button>
            </Link>
            <div className="absolute top-2 left-2">
              <MovieMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} position="left" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
