import React from "react";
import { GenresFilterProps } from "../movie.type";

const GenresFilter: React.FC<GenresFilterProps> = ({ genres, selectedGenres, onGenreChange }) => {
  return (
    <ul className="flex flex-wrap">
      {genres.map((genre) => (
        <li key={genre.id} className="mb-2 w-1/2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre.id)}
              onChange={() => onGenreChange(genre.id)}
              className="hidden"
            />
            <span
              className={`relative w-5 h-5 border-2 rounded-md transition-colors duration-200 ${
                selectedGenres.includes(genre.id) ? "bg-primary border-transparent" : "bg-transparent border-gray-400"
              }`}
            >
              <span
                className={`absolute inset-0 rounded-md transition-transform duration-200 transform ${
                  selectedGenres.includes(genre.id) ? "scale-100" : "scale-0"
                } bg-white`}
              />
            </span>
            <span className="text-gray-300">{genre.name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default GenresFilter;
