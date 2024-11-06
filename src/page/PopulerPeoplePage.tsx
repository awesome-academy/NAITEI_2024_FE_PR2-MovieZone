import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { fetchData } from "../services/fetchData";
import PeopleCard from "../component/PeopleCard";
import Pagination from "../component/Pagination";
import { Person } from "../movie.type";

const PopularPeoplePage: React.FC = () => {
  const { t } = useTranslation();
  const [people, setPeople] = useState<Person[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cardsPerPage] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchPeople = async () => {
    const queryParams = `_page=${currentPage}&_limit=${cardsPerPage}`;
    const response = await fetchData("people", queryParams);

    if (response && response.data && response.totalCount) {
    setPeople(response.data);
    setTotalPages(Math.ceil(response.totalCount / cardsPerPage));
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="text-white my-16 container max-w-screen-xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-5">{t('popularPeoplePage.popularPeople')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {people.map((person: Person) => (
          <PeopleCard key={person.id} person={person} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        maxPagesToShow={4}
      />
    </div>
  );
};

export default PopularPeoplePage;
