import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Person } from '../movie.type';
import { fetchData } from "../services/fetchData";
import MovieCarousel from "../component/MovieCarousel";

const PersonDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      const response = await fetchData("people", `id=${id}`);
      setPerson(response.data[0]);
    };

    fetchPerson();
  }, [id]);

  if (!person) return <div>{t('PersonDetailPage.noFound')}</div>;
  
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-6 flex md:flex-row flex-col text-white">
      <div className="md:w-1/3 flex md:flex-col items-center flex-row md:items-start md:gap-8 mb-8">
        <img
          src={require(`../assets/image/people/profile${person.profile_path}`)}
          alt={person.name}
          className="rounded-lg shadow-lg mb-4 md:mb-0 w-1/3 md:w-full"
        />
        <div className="md:ml-0 ml-3 text-left space-y-3 w-2/3">
          <h1 className="text-xl text-white font-bold">{t('PersonDetailPage.info')}</h1>
          <h2 className="text-3xl font-semibold md:hidden">{person.name}</h2>
          <div>
            <h1 className="text-lg text-white font-semibold">{t('PersonDetailPage.knownFor')}</h1>
            <p className="text-gray-300">{person.known_for_department}</p>
          </div>
          <div>
            <h1 className="text-lg text-white font-semibold">{t('PersonDetailPage.gender')}</h1>
            <p className="text-gray-300">{person.gender === 1 ? t('PersonDetailPage.female') : t('PersonDetailPage.male')}</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-3xl font-semibold md:block hidden mt-2">{person.name}</h2>
        <MovieCarousel 
          title={t('PersonDetailPage.knownFor')}
          data={person.known_for}
        />
      </div>
    </div>
  );
};

export default PersonDetail;
