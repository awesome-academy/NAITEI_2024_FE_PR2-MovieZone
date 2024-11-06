import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { fetchData } from "../services/fetchData";
import GenresFilter from "./GenresFilter";
import ReleaseDateFilter from "./ReleaseDateFilter";
import RatingFilter from "./RatingFilter";
import LanguageFilter from "./LanguageFilter";
import { Genre, Language, FilterSidebarProps, Filters } from "../movie.type";

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, filters: initialFilters }) => {
  const { t } = useTranslation();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [languages, setLanguages] = useState<Language[]>([]);

  const handleGenreChange = (genreId: number) => {
    setFilters((prevFilters) => {
      const updatedGenres = prevFilters.selectedGenres.includes(genreId)
        ? prevFilters.selectedGenres.filter((id) => id !== genreId)
        : [...prevFilters.selectedGenres, genreId];
      return { ...prevFilters, selectedGenres: updatedGenres };
    });
  };

  const handleReleaseDateChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setFilters((prevFilters) => {
      const newDateRange = [...prevFilters.releaseDateRange] as [string, string];
      newDateRange[index] = e.target.value;
      return { ...prevFilters, releaseDateRange: newDateRange };
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, originalLanguage: newLanguage }));
  };


  const handleVoteAverageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setFilters((prevFilters) => {
      const newVoteAverageRange = [...prevFilters.voteAverageRange] as [number, number];
      newVoteAverageRange[index] = Number(e.target.value);
      return { ...prevFilters, voteAverageRange: newVoteAverageRange };
    });
  };

  useEffect(() => {
    const getData = async () => {
      const genresResponse = await fetchData("movie_genres");
      const languagesResponse = await fetchData("languages");

      setGenres(genresResponse.data);
      setLanguages(languagesResponse.data);
    };

    getData();
  }, []);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <div className="bg-dark rounded-md p-4">
      <div>
        <h3 className="font-bold text-lg mb-4">{t('moviePage.genres')}</h3>
        <GenresFilter genres={genres} selectedGenres={filters.selectedGenres} onGenreChange={handleGenreChange} />
      </div>
      <div className="relative">
        <h3 className="font-bold text-lg mt-4 mb-2">{t('moviePage.language')}</h3>
        <LanguageFilter originalLanguage={filters.originalLanguage} languages={languages} onLanguageChange={handleLanguageChange} />
      </div>
      <div>
        <h3 className="font-bold text-lg mt-6 mb-4">{t('moviePage.releaseDate')}</h3>
        <ReleaseDateFilter releaseDateRange={filters.releaseDateRange} onDateChange={handleReleaseDateChange} />
      </div>
      <div className="mb-20">
        <h3 className="font-bold text-lg mt-4 mb-4">{t('moviePage.rating')}</h3>
        <RatingFilter voteAverageRange={filters.voteAverageRange} onVoteChange={handleVoteAverageChange} />
      </div>
    </div>
  );
};

export default FilterSidebar;
