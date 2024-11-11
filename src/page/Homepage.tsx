import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import HeroSlider from "../component/HeroSlider";
import MovieCarousel from "../component/MovieCarousel";
import Leaderboard from "../component/Leaderboard";
import { Movie } from "../movie.type";
import { fetchData } from "../services/fetchData";
import { useUser } from '../context/UserContext';

const Homepage: React.FC = () => {
  const { t } = useTranslation();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [recentlyReleased, setRecentlyReleased] = useState<Movie[]>([]);
  const [leaderboardMovies, setLeaderboardMovies] = useState<Movie[]>([]);
  const [sortField, setSortField] = useState<"vote_average" | "vote_count">("vote_average");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [recentIdMovies, setRecentIdMovies] = useState<string[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const { userInfo } = useUser();

  useEffect(() => {
    if (userInfo) {
      const storedRecentIdMovies = JSON.parse(localStorage.getItem(`recentMovies_${userInfo.id}`) || '[]');
      setRecentIdMovies(storedRecentIdMovies);
    }
  }, [userInfo]);

  useEffect(() => {
    if (recentIdMovies.length > 0) {
      const movieIdsParam = recentIdMovies.map((id) => `id=${id}`).join('&');
      const getMoviesByIds = async () => {
        const response = await fetchData("movie",`${movieIdsParam}`);
        const orderedMovies: Movie[] = recentIdMovies.map((id: string) => 
          response.data.find((movie: Movie) => movie.id === Number(id))
        );
        setRecentMovies(orderedMovies);
      };

      getMoviesByIds();
    }
  }, [recentIdMovies, setRecentMovies]);

  useEffect(() => {
    const getMovies = async () => {
      const popularitySortResponse = await fetchData("movie", "_limit=15&_sort=popularity&_order=desc");
      const voteAvarageSortResponse = await fetchData("movie", "_limit=15&_sort=vote_average&_order=desc");
      const recentlyDateSortResponse = await fetchData("movie", "_limit=15&_sort=release_date&_order=desc");
      
      setTrendingMovies(popularitySortResponse.data);
      setTopRatedMovies(voteAvarageSortResponse.data);
      setRecentlyReleased(recentlyDateSortResponse.data);
    };

    getMovies();
  }, []);

  useEffect(() => {
    const getMovies = async () => {
      const limit = 10;
      const leaderboardResponse = await fetchData(
        "movie", `_page=${currentPage}&_limit=${limit}&_sort=${sortField}&_order=${sortOrder}`
      );
      
      const totalCount = leaderboardResponse.totalCount;
      setTotalPages(Math.ceil(totalCount / limit));

      setLeaderboardMovies(leaderboardResponse.data);
    };

    getMovies();
  }, [sortField, sortOrder, currentPage]);

  const handleSort = (field: "vote_average" | "vote_count") => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="text-white">
      <HeroSlider movies={trendingMovies.slice(0, 5)} />
      <MovieCarousel title={t('home.trending')} data={trendingMovies} />
      <MovieCarousel title={t('home.recentlyReleased')} data={recentlyReleased} style="horizontal"/>
      <MovieCarousel title={t('home.topRated')} data={topRatedMovies} />
      {recentMovies.length > 0 && 
        <MovieCarousel title={t('home.recentlyMovie')} data={recentMovies} style="horizontal" />
      }
      <Leaderboard
        movies={leaderboardMovies}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Homepage;
