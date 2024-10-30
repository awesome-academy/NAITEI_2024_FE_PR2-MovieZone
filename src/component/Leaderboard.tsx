import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Movie , LeaderboardProps } from "../movie.type";

import angleDown from "../assets/icon/angle-down.svg";
import angleUp from "../assets/icon/angle-up.svg";
import Pagination from "./Pagination"; 
import MovieModal from "./MovieModal";

const Leaderboard: React.FC<LeaderboardProps> = ({
  movies,
  onSort,
  sortField,
  sortOrder,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="my-8 container max-w-screen-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">{t('leaderboard')}</h2>
      <div className="bg-dark rounded-lg p-4 shadow-md">
        <table className="w-full text-left text-sm text-gray-200">
          <thead>
            <tr className="border-b border-gray-700 font-bold">
              <th className="py-2 px-4">{t('rank')}</th>
              <th className="py-2 px-4">{t('movies')}</th>
              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => onSort("vote_average")}
              >
                <div className="flex items-center">
                  <span>{t('rating')}</span>
                  {sortField === "vote_average" && (
                    sortOrder === "asc" 
                      ? <img src={angleUp} alt="Angle Up" className="ml-1" /> 
                      : <img src={angleDown} alt="Angle Down" className="ml-1" />
                  )}
                </div>
              </th>
              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => onSort("vote_count")}
              >
                <div className="flex items-center">
                  <span>{t('votes')}</span>
                  {sortField === "vote_count" && (
                    sortOrder === "asc" 
                      ? <img src={angleUp} alt="Angle Up" className="ml-1" /> 
                      : <img src={angleDown} alt="Angle Down" className="ml-1" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr 
                key={movie.id} 
                className="hover:bg-charcoal hover:border-l-white border-l-4 border-l-transparent transition cursor-pointer"
                onClick={() => handleMovieClick(movie)}
              >
                <td className="py-2 px-4">{(currentPage - 1) * 10 + index + 1}</td>
                <td className="py-2 px-4">{movie.title}</td>
                <td className="py-2 px-4">{movie.vote_average.toFixed(1)}</td>
                <td className="py-2 px-4">{movie.vote_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange}
          maxPagesToShow={3}
        />
      </div>
      {isModalOpen && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Leaderboard;
