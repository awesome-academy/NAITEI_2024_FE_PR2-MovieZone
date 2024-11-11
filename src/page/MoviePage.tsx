import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Movie, Filters } from "../movie.type";
import { fetchData } from "../services/fetchData";
import MovieCard from "../component/MovieCard";
import FilterSidebar from "../component/FilterSidebar";
import Pagination from "../component/Pagination";
import Dropdown from "../component/MovieListDropdown";
import useDebounce from "../utils/useDebounce";
import { ReactComponent as Reset } from "../assets/icon/reset.svg";
import { ReactComponent as Close } from "../assets/icon/close.svg";
import { ReactComponent as Filter } from "../assets/icon/filter.svg";

const MoviePage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isMoviePage = location.pathname.startsWith("/movie");
  const isTVPage = location.pathname.startsWith("/tv");
  const dateField = isMoviePage ? "release_date" : "first_air_date"
  const urlParams = new URLSearchParams(window.location.search);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filters, setFilters] = useState<Filters>({
    selectedGenres: urlParams.getAll('genre').map(genre => Number(genre)) as number[],
    releaseDateRange: [
      urlParams.get('dateFrom') || "",
      urlParams.get('dateto') || ""
    ],
    voteAverageRange: [
      Number(urlParams.get('ratingMin')) || 0,
      Number(urlParams.get('ratingMax')) || 10
    ],
    originalLanguage: urlParams.get('lang') || "",
  });
  const [currentPage, setCurrentPage] = useState<number>(Number(urlParams.get('page')) || 1);
  const [cardsPerPage, setCardsPerPage] = useState<number>(Number(urlParams.get('limit')) || 12);
  const [totalPages, setTotalPages] = useState<number>(1);
  const sort = urlParams.get('sort');
  const order = urlParams.get('order');
  const [sortBy, setSortBy] = useState<string | null>(sort && order ? `${sort}.${order}` : null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [applyFilter, setApplyFilter] = useState<boolean>(false);
  const debouncedApplyFilter = useDebounce(applyFilter, 500);

  const updateUrlParams = (updatedFilters: Filters, limit?: number, page?: number, sort?: string | null) => {
    const newUrlParams = new URLSearchParams();
  
    updatedFilters.selectedGenres.forEach((genre) => {
      newUrlParams.append('genre', String(genre));
    });
    if (updatedFilters.releaseDateRange[0]) newUrlParams.set('dateFrom', updatedFilters.releaseDateRange[0]);
    if (updatedFilters.releaseDateRange[1]) newUrlParams.set('dateto', updatedFilters.releaseDateRange[1]);
    newUrlParams.set('ratingMin', updatedFilters.voteAverageRange[0].toString());
    newUrlParams.set('ratingMax', updatedFilters.voteAverageRange[1].toString());
    if (updatedFilters.originalLanguage) newUrlParams.set('lang', updatedFilters.originalLanguage);
    if (sort) {
      newUrlParams.set('sort', sort.split('.')[0]);
      newUrlParams.set('order', sort.split('.')[1]);
    }
    if (limit) newUrlParams.set('limit', limit.toString());
    if (page) newUrlParams.set('page', page.toString());
  
    if (window.location.search !== `?${newUrlParams.toString()}`) {
      window.history.pushState({}, '', `${window.location.pathname}?${newUrlParams.toString()}`);
    }
  };

  const handleFilterChange = (updatedFilters: Filters) => {
    setFilters(updatedFilters);
    setCurrentPage(1);
    setApplyFilter(true);
  };

  const handleCardsPerPageChange = (value: number | null) => {
    if (value !== null) {
      setCardsPerPage(value);
      setCurrentPage(1);
      setApplyFilter(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setApplyFilter(true);
  };

  const handleSortChange = (value: string | null) => {
    setSortBy(value);
    setCurrentPage(1);
    setApplyFilter(true);
  };

  const handleResetFilters = () => {
    handleFilterChange({
      selectedGenres: [],
      releaseDateRange: ["", ""],
      voteAverageRange: [0, 10],
      originalLanguage: "",
    });
    setCardsPerPage(12);
    setSortBy(null);
  };

  const buildQueryParams = () => {
    const { selectedGenres, releaseDateRange, voteAverageRange, originalLanguage } = filters;
    
    const queryParts = [
      selectedGenres.length > 0 && selectedGenres.map((genre) => `genre_ids_like=${genre}`).join('&'),
      releaseDateRange[0] !== "" && `${dateField}_gte=${releaseDateRange[0]}`,
      releaseDateRange[1] !== "" && `${dateField}_lte=${releaseDateRange[1]}`,
      voteAverageRange && `vote_average_gte=${voteAverageRange[0]}&vote_average_lte=${voteAverageRange[1]}`,
      originalLanguage && `original_language=${originalLanguage}`,
      sortBy && `_sort=${sortBy.split('.')[0]}&_order=${sortBy.split('.')[1]}`,
      `_page=${currentPage}`,
      `_limit=${cardsPerPage}`,
    ]

    return queryParts.filter(Boolean).join('&');
  };

  const cardPerPageOptions = [
    { value: 12, label: "12" },
    { value: 24, label: "24" },
    { value: 36, label: "36" },
    { value: 48, label: "48" },
  ];

  const sortOptions = [
    { value: null, label: t('moviePage.selectSortingOption') },
    { value: "popularity.desc", label: t('moviePage.popularityDesc') },
    { value: "popularity.asc", label: t('moviePage.popularityAsc') },
    { value: "vote_average.desc", label: t('moviePage.voteAverageDesc') },
    { value: "vote_average.asc", label: t('moviePage.voteAverageAsc') },
    ...(isMoviePage
      ? [
          { value: "release_date.desc", label: t('moviePage.releaseDateDesc') },
          { value: "release_date.asc", label: t('moviePage.releaseDateAsc') },
        ]
      : [
          { value: "first_air_date.desc", label: t('moviePage.firstAirDateDesc') },
          { value: "first_air_date.asc", label: t('moviePage.firstAirDateAsc') },
        ]),
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      const queryParams = buildQueryParams();
      const endpoint = isMoviePage ? "movie" : "tv";
      const response = await fetchData(endpoint, queryParams);

      setMovies(response.data);
      setTotalPages(Math.ceil(response.totalCount / cardsPerPage));
      setApplyFilter(false);
    };
  
    if (debouncedApplyFilter) {
      updateUrlParams(filters, cardsPerPage, currentPage, sortBy);
      fetchMovies();
    }
  }, [debouncedApplyFilter, filters, cardsPerPage, currentPage, sortBy]);

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      setFilters({
        selectedGenres: urlParams.getAll('genre').map(genre => Number(genre)),
        releaseDateRange: [
          urlParams.get('dateFrom') || "",
          urlParams.get('dateto') || ""
        ],
        voteAverageRange: [
          Number(urlParams.get('ratingMin')) || 0,
          Number(urlParams.get('ratingMax')) || 10
        ],
        originalLanguage: urlParams.get('lang') || "",
      });
      setCurrentPage(Number(urlParams.get('page')) || 1);
      setCardsPerPage(Number(urlParams.get('limit')) || 12);
      setSortBy(urlParams.get('sort') && urlParams.get('order') ? `${urlParams.get('sort')}.${urlParams.get('order')}` : null);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isFilterVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isFilterVisible]);

  useEffect(() => {
    const getTodayDate = () => {
      const today = new Date();
      return today.toISOString().split('T')[0]; 
    };

    setSortBy("popularity.desc");
    if (location.pathname.includes('/top-rated')) {
      setSortBy("vote_average.desc");
    }
    
    if (isMoviePage && location.pathname.includes('/now-playing')) {
      setFilters(prevFilters => ({
        ...prevFilters,
        releaseDateRange: [getTodayDate(), ""]
      }));
      setSortBy(null);
    }

    if (isMoviePage && location.pathname.includes('/upcoming')) {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const nextDay = today.toISOString().split('T')[0];
      setFilters(prevFilters => ({
        ...prevFilters,
        releaseDateRange: [nextDay, ""]
      }));
      setSortBy(null);
    }

    if (isTVPage && location.pathname.includes('/airing-today')) {
      const today = getTodayDate();
      setFilters(prevFilters => ({
        ...prevFilters,
        releaseDateRange: [today, today]
      }));
      setSortBy(null);
    }

    if (isTVPage && location.pathname.includes('/on-tv')) {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const todayFormatted = today.toISOString().split('T')[0];
      const nextWeekFormatted = nextWeek.toISOString().split('T')[0];
      setFilters(prevFilters => ({
        ...prevFilters,
        releaseDateRange: [todayFormatted, nextWeekFormatted]
      }));
      setSortBy(null);
    }

    if (isTVPage && location.pathname.includes('/top-rated')) {
      setSortBy("vote_average.desc");
    }
  }, []);

  return (
    <div className="text-white my-16 container max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row md:space-x-4 md:items-start">
        <div className="w-1/4 text-3xl mb-5 font-bold justify-between md:flex hidden">
          <span>{isMoviePage ? t('moviePage.movies') : t('moviePage.tvShows')}</span>
          <button
            className="ml-4 px-2 py-1"
            onClick={handleResetFilters}
          >
            <Reset className="w-5 h-5 fill-white" />
          </button>
        </div>
        <div className="md:w-3/4 flex justify-end space-x-4 md:p-0 p-4">
          <Dropdown
            label={t('moviePage.sortBy')}
            selectedValue={sortBy}
            options={sortOptions}
            onChange={handleSortChange}
          />
          <Dropdown
            label={t('moviePage.cardPerPage')}
            selectedValue={cardsPerPage}
            options={cardPerPageOptions}
            onChange={handleCardsPerPageChange}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 md:items-start">
        <div className="w-1/4 md:block hidden">
          <FilterSidebar onFilterChange={handleFilterChange} filters={filters}/>
        </div>
        <div className="md:w-3/4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:p-0 p-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxPagesToShow={4}
            />
        </div>
      </div>
      
      <button
        className="fixed bottom-1/3 left-2 bg-primary text-white p-3 rounded-full shadow-lg md:hidden"
        onClick={() => setIsFilterVisible(true)}
      >
        <Filter className="w-4 h-4 fill-white"/>
      </button>
      {isFilterVisible && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsFilterVisible(false)} />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 h-[600px] transition-transform transform overflow-y-auto ${
          isFilterVisible ? 'translate-y-0' : 'translate-y-full'
        } md:hidden z-50`}
      >
        <FilterSidebar onFilterChange={handleFilterChange} filters={filters} />
        <button
          className="absolute top-4 right-16 bg-gray-600 p-2 rounded"
          onClick={handleResetFilters}
        >
          <Reset className="w-4 h-4" />
        </button>
        <button
          className="absolute top-4 right-4 bg-primary p-2 rounded"
          onClick={() => setIsFilterVisible(false)}
        >
          <Close className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MoviePage;
