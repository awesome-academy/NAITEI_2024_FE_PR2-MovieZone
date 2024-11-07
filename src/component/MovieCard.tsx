import React from "react";
import { Link } from "react-router-dom";
import { MovieCardProps } from "../movie.type";
import MovieMenu from "./MovieMenu";
import useToggleVisibility from "../utils/useToggleVisibility";

const MovieCard: React.FC<MovieCardProps> = ({
  movie, style, onMouseEnter
}) => {
  const { isOpen, toggle, elementRef } = useToggleVisibility();

  return (
    <div className={`relative p-2 ${style === "horizontal" ? "md:min-w-[305px] min-w-[230px]" : "md:min-w-[240px] min-w-[180px] mb-3"}`}>
      <Link to={`/${movie.title ? "movie" : "tv"}/${movie.id}`}>
        <img
          src={style === "horizontal" 
            ? require(`../assets/image/${movie.title ? "movie" : "tv"}/backdrop${movie.backdrop_path}`) 
            : require(`../assets/image/${movie.title ? "movie" : "tv"}/poster${movie.poster_path}`)}
          alt={movie.title || movie.name}
          onMouseEnter={() => onMouseEnter?.(movie)}
          className="rounded transition hover:scale-105"
        />
      </Link>
      <h3 className="mt-2 font-medium">{movie.title || movie.name}</h3>
      <div className={`text-sm flex justify-between ${style === "horizontal" ? "text-white" : "text-gray-500"}`}>
        <span>{movie.release_date || movie.first_air_date}</span>
        <span className="border rounded-md border-yellow-400 text-yellow-400 px-1 font-bold">
          {movie.vote_average.toFixed(1)}
        </span>
      </div>

      <div className="absolute top-3 right-3" ref={elementRef}>
        <MovieMenu isOpen={isOpen} toggleMenu={toggle} />
      </div>
    </div>
  );
};

export default MovieCard;
