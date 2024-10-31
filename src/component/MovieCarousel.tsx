import React, { useState, useEffect, useRef } from "react";
import { Movie, MovieCarouselProps } from "../movie.type";
import MovieCard from "./MovieCard";

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, movies, style = "vertical" }) => {
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const backgroundImage =
    style === "horizontal" && activeMovie
      ? require(`../assets/image/movie/backdrop${activeMovie.backdrop_path}`)
      : undefined;

  const handleMouseLeave = () => {
    setActiveMenuId(null);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    if (movies.length > 0) {
      setActiveMovie(movies[0]);
    }
  }, [movies]);

  return (
    <div className="my-8 container max-w-screen-xl mx-auto p-4" onMouseLeave={handleMouseLeave}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative flex gap-4 overflow-x-auto">
        {style === "horizontal" && activeMovie && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300 opacity-40"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}

        <div
          className={`relative flex gap-4 overflow-x-auto scrollbar-hidden hover:scrollbar-visible ${style === "horizontal" ? "p-3 pt-10" : "p-2"}`}
          ref={carouselRef}
          onScroll={handleScroll}
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id}
              movie={movie}
              style={style}
              onMouseEnter={setActiveMovie}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
            />
          ))}
        </div>

        {showLeftGradient && (
          <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-dark to-transparent pointer-events-none z-10" />
        )}

        {showRightGradient && (
        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-dark to-transparent pointer-events-none z-10" />
        )}
      </div>
    </div>
  );
};

export default MovieCarousel;
