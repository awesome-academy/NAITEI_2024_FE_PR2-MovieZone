import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Movie, Participants, MovieCarouselProps } from "../movie.type";
import MovieCard from "./MovieCard";

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, data, style = "vertical", type="movie" }) => {
  const [activeMovie, setActiveMovie] = useState<Movie |  Participants | null>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const backgroundImage =
    style === "horizontal" && activeMovie &&  type === "movie"
      ? require(`../assets/image/movie/backdrop${(activeMovie  as Movie).backdrop_path}`)
      : undefined;

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setActiveMovie(data[0]);
    }

    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      const hasScrollableContent = scrollWidth > clientWidth;
      setShowLeftGradient(false);
      setShowRightGradient(hasScrollableContent);
    }
  }, [data]);

  return (
    <div className="my-8 container max-w-screen-xl mx-auto p-4">
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
          {data?.map((item, index) => {
            if (type === "movie") {
              return (
                <MovieCard
                  key={index}
                  movie={item as Movie}
                  style={style}
                  onMouseEnter={() => setActiveMovie(item)}
                />
              );
            } else if (type === "participant") {
              const participant = item as Participants;
              return (
                <div
                  key={index}
                  className="relative cursor-pointer hover:scale-105 duration-200 min-w-[150px]"
                >
                  <div className="overflow-hidden rounded-md">
                    <Link to={`/person/${item.id}`}>
                      <img
                        src={require(`../assets/image/people/profile${participant.profile_path}`)}
                        alt={participant.name}
                        className="w-full h-60 object-cover"
                      />
                    </Link>
                  </div>
                  <div className="mt-2">
                    <p className="font-semibold">{participant.name}</p>
                    <p className="text-sm text-gray-500">{participant.character}</p>
                  </div>
                </div>
              );
            }
            return null;
          })}
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
