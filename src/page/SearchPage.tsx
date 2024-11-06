import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchData } from "../services/fetchData";
import Pagination from "../component/Pagination";
import PeopleCard from "../component/PeopleCard";
import MovieCard from "../component/MovieCard";
import { Person, Movie } from "../movie.type";

const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  
  const [activeTab, setActiveTab] = useState<'movie' | 'tv' | 'people' | null>(null);
  const [filteredResults, setFilteredResults] = useState<(Movie | Person)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [tabs, setTabs] = useState([
    { name: 'movie', label: t('searchPage.movies'), count: 0 },
    { name: 'tv', label: t('searchPage.tvShows'), count: 0 },
    { name: 'people', label: t('searchPage.people'), count: 0 },
  ]);

  const fetchAllResults = async () => {
    const resultCounts = await Promise.all(['movie', 'tv', 'people'].map(async (tab) => {
      const response = await fetchData(tab, `q=${query}&_page=1&_limit=${cardsPerPage}`);
      return { tab, count: response.totalCount, data: response.data };
    }));

    const sortedTabs = resultCounts
    .map(({ tab, count }) => ({
      name: tab,
      label: t(`searchPage.${tab}`),
      count: count,
    }))
    .sort((a, b) => b.count - a.count);

    setTabs(sortedTabs);

    const tabWithMostResults = sortedTabs[0].name;
    setActiveTab(tabWithMostResults as 'movie' | 'tv' | 'people');
    
    const mostResultsData = resultCounts.find(
      (result) => result.tab === tabWithMostResults
    )?.data;

    setFilteredResults(mostResultsData);
    setTotalPages(Math.ceil(mostResultsData.length / cardsPerPage));
  };

  const fetchTabResults = async () => {
    const response = await fetchData(activeTab as string, `q=${query}&_page=${currentPage}&_limit=${cardsPerPage}`);
    setFilteredResults(response.data);
    setTotalPages(Math.ceil(response.totalCount / cardsPerPage));
  };

  const handleTabChange = (tab: 'movie' | 'tv' | 'people') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (query) {
      fetchAllResults();
    }
  }, [query]);
  
  useEffect(() => {
    if (activeTab) {
      fetchTabResults();
    }
  }, [activeTab, currentPage]);

  return (
    <div className="container max-w-screen-xl mx-auto p-4 py-8 flex md:flex-row flex-col items-start">
      <div className="flex flex-col md:w-1/4 w-full bg-dark rounded-md">
        <div className="text-xl font-bold py-3 text-white bg-primary rounded-t-md">
          <span className="p-4">{t('searchPage.searchResults')}</span>
        </div>
        {tabs.map((tab) => (
          <div 
            key={tab.name}
            className={`p-4 cursor-pointer ${activeTab === tab.name ? 'bg-gray-400 text-charcoal font-bold' : 'text-white'}`} 
            onClick={() => handleTabChange(tab.name as 'movie' | 'tv' | 'people')}
          >
            {tab.label} ({tab.count})
          </div>
        ))}
      </div>
      <div className="md:w-3/4 w-full md:ml-4 md:mt-0 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) =>
              "overview" in item ? (
                <MovieCard
                  key={item.id}
                  movie={item as Movie}
                />
              ) : (
                <PeopleCard key={item.id} person={item as Person} />
              )
            )
          ) : (
            <p className="py-2 text-3xl text-white col-span-4 text-center">{t('searchPage.noResults')}</p>
          )}
        </div>
        <div className="mt-4 text-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxPagesToShow={3}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
