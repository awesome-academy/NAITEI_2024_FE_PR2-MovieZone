import React from "react";
import { Link } from "react-router-dom";
import { MovieCardProps } from "../movie.type";
import MovieMenu from "./MovieMenu";
import Tooltip from "./Tooltip";
import useToggleVisibility from "../utils/useToggleVisibility";

const MovieCard: React.FC<MovieCardProps> = ({
  movie, style, onMouseEnter
}) => {
  const { isOpen, toggle, elementRef } = useToggleVisibility();

  return (
    <div
      className={`relative p-2 
      ${style === "horizontal" ? "md:min-w-[305px] min-w-[230px]" : "md:min-w-[240px] min-w-[180px] mb-3"} 
      ${style === "flex" ? "flex border-2 rounded-md p-0": ""}`}
    >
      <Link to={`/${movie.title ? "movie" : "tv"}/${movie.id}`}>
        <img
          src={style === "horizontal" 
            ? require(`../assets/image/${movie.title ? "movie" : "tv"}/backdrop${movie.backdrop_path}`) 
            : require(`../assets/image/${movie.title ? "movie" : "tv"}/poster${movie.poster_path}`)}
          alt={movie.title || movie.name}
          onMouseEnter={() => onMouseEnter?.(movie)}
          className={`rounded transition hover:scale-105 ${style === "horizontal" ? "md:max-w-[305px] max-w-[230px] h-auto" : "md:max-w-[230px] max-w-[180px] h-auto"} ${style === "flex" ? "hover:scale-100 w-36": ""}`}
        />
      </Link>
      <div className={`${style === "flex" ? "mt-0 flex flex-col flex-1 p-4" : "mt-2"}`}>
        <h3 className={style === "flex" ? "text-xl font-semibold" : "font-medium"}>{movie.title || movie.name}</h3>
        
        {style === "flex" && (
          <Tooltip text={movie.overview} width={'md:w-[350px] w-[200px]'}>
            <p className="text-gray-200 md:text-sm text-xs line-clamp-4">{movie.overview}</p>
          </Tooltip>
        )}
        
        <div className={`text-sm flex justify-between ${style === "horizontal" ? "text-white" : "text-gray-500"} mt-auto`}>
          <span>{movie.release_date || movie.first_air_date}</span>
          <span className="border rounded-md border-yellow-400 text-yellow-400 px-1 font-bold">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
      
      { style === "flex" ? (
        <div className="absolute top-3 left-3" ref={elementRef}>
          <MovieMenu isOpen={isOpen} toggleMenu={toggle} movieId={movie.id} type={movie.title ? "movie" : "tv"} position="left"/>
        </div>
      ) : (
        <div className="absolute top-3 right-3" ref={elementRef}>
          <MovieMenu isOpen={isOpen} toggleMenu={toggle} movieId={movie.id} type={movie.title ? "movie" : "tv"} />
        </div>
      )}
    </div>
  );
};

export default MovieCard;
