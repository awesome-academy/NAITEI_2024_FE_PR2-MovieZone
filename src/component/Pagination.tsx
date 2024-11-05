import React from "react";
import angleLeft from "../assets/icon/angle-left.svg"; 
import angleRight from "../assets/icon/angle-right.svg";
import { PaginationProps } from "../movie.type";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPagesToShow
}) => {
  const getPages = () => {
    const pages = [];
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
  
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= halfMaxPagesToShow) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      }
      else if (currentPage > totalPages - halfMaxPagesToShow) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }
      else {
        for (let i = currentPage - halfMaxPagesToShow; i <= currentPage + halfMaxPagesToShow; i++) {
          if (i > 0 && i <= totalPages) {
            pages.push(i);
          }
        }
      }
    }
  
    return pages;
  };

  if (totalPages <=1 ) {
    return null;
  }

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`bg-charcoal text-white h-8 w-8 rounded-full flex items-center justify-center ${currentPage !== 1 ? "hover:bg-primary" : ""}`}
      >
        <img src={angleLeft} alt="Previous" className="w-4 h-4" />
      </button>
      {getPages().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-8 w-8 rounded-full flex items-center justify-center ${currentPage === page ? 'bg-primary' : 'bg-charcoal text-white hover:bg-primary'}`}
        >
          {page}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`bg-charcoal text-white h-8 w-8 rounded-full flex items-center justify-center ${currentPage !== totalPages ? "hover:bg-primary" : ""}`}
      >
        <img src={angleRight} alt="Next" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
