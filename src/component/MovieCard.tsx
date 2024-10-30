import React from "react";
import { Link } from "react-router-dom";
import { MovieCardProps } from "../movie.type";
import MovieMenu from "./MovieMenu";

const MovieCard: React.FC<MovieCardProps> = ({
  movie, style, onMouseEnter, activeMenuId, setActiveMenuId 
}) => {
  const isActiveMenu = activeMenuId === movie.id;
  
  const toggleMenu = () => {
    if (isActiveMenu) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(movie.id);
    }
  };

  return (
    <div className={style === "horizontal" ? "md:min-w-[305px] min-w-[230px] relative" : "md:min-w-[240px] min-w-[180px] mb-3 relative"}>
      <Link to={`/movie/${movie.id}`} className="block">
        <img
          src={style === "horizontal" 
            ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}` 
            : `https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          onMouseEnter={() => onMouseEnter(movie)}
          className="rounded transition hover:scale-105"
        />
      </Link>
      <h3 className="mt-2 font-medium">{movie.title}</h3>
      <div className={`text-sm flex justify-between ${style === "horizontal" ? "text-white" : "text-gray-500"}`}>
        <span>{movie.release_date}</span>
        <span className="border rounded-md border-yellow-400 text-yellow-400 px-1 font-bold">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      <div className="absolute top-2 right-2">
        <MovieMenu isOpen={isActiveMenu} toggleMenu={toggleMenu} />
      </div>
    </div>
  );
};

export default MovieCard;
