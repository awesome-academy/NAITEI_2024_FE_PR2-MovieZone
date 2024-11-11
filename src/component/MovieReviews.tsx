import React, { useState } from 'react';
import Tooltip from './Tooltip';
import { useTranslation } from 'react-i18next';
import { MovieReviewsProps, Review } from "../movie.type";

const MovieReviews: React.FC<MovieReviewsProps> = ({ reviews }) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4">{t('MovieDetailPage.reviews')}</h2>
      
      {reviews && reviews.length > 0 && (
        <div className="pb-4 mb-4">
          <div className="flex items-center mb-2">
            <img
              src={require(`../assets/image/useravatar${reviews[0].author_details.avatar_path}`)}
              alt={reviews[0].author}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div className="flex flex-col w-full">
              <span className="font-semibold">{reviews[0].author}</span>
              <div className="flex items-center">
                <span className="border text-sm rounded-md border-yellow-400 text-yellow-400 px-1 font-bold mr-3">
                  {reviews[0].author_details.rating.toFixed(1)}
                </span>
                <p className="text-sm text-gray-500">
                  {new Date(reviews[0].created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <Tooltip text={reviews[0].content} width="md:w-[700px] w-[300px]">
            <p className="text-sm whitespace-pre-line line-clamp-6">{reviews[0].content}</p>
          </Tooltip>
        </div>
      )}

      {showAll && reviews.slice(1).map((review: Review) => (
        <div key={review.id} className="border-t-2 pt-4 mt-4">
          <div className="flex items-center mb-2">
            <img
              src={require(`../assets/image/useravatar${review.author_details.avatar_path}`)}
              alt={review.author}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div className="flex flex-col w-full">
              <span className="font-semibold">{review.author}</span>
              <div className="flex items-center">
                <span className="border text-sm rounded-md border-yellow-400 text-yellow-400 px-1 font-bold mr-3">
                  {review.author_details.rating.toFixed(1)}
                </span>
                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <Tooltip text={review.content} width="md:w-[700px] w-[300px]">
            <p className="text-sm whitespace-pre-line line-clamp-6">{review.content}</p>
          </Tooltip>
        </div>
      ))}

      <button
        className="mt-4 text-blue-500 font-semibold hover:text-blue-300"
        onClick={handleShowAll}
      >
        {showAll ? t('MovieDetailPage.showLess') : t('MovieDetailPage.showMore')}
      </button>
    </div>
  );
};

export default MovieReviews;
