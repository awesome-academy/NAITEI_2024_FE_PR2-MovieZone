import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { HeroSliderProps } from "../movie.type";

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length, currentIndex]);

  return (
    <div className="relative overflow-hidden w-full h-[400px] md:h-[700px]">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-full flex-shrink-0 h-[400px] md:h-[700px] relative bg-cover bg-center"
            style={{
              backgroundImage: `url(${require(`../assets/image/movie/backdrop${movie.backdrop_path}`)})`
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end items-start md:pl-16 md:pb-16 pl-6 pb-6">
              <div className="md:w-1/3 w-3/4">
                <h1 className="text-white md:text-5xl text-xl font-bold">{movie.title}</h1>
                <p className="text-gray-200 mt-2 md:text-xl text-xs">{movie.overview}</p>
                <Link to={`/movie/${movie.id}`}>
                  <button className="bg-primary text-white font-semibold md:py-3 md:px-6 py-1 px-2 rounded mt-4 hover:bg-red-800">
                    {t('watchNow')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
