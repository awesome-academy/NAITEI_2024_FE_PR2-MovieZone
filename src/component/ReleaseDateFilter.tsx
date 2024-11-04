import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ReleaseDateFilterProps } from "../movie.type";

const ReleaseDateFilter: React.FC<ReleaseDateFilterProps> = ({ releaseDateRange, onDateChange }) => {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useState(releaseDateRange[0]);
  const [toDate, setToDate] = useState(releaseDateRange[1]);

  useEffect(() => {
    setFromDate(releaseDateRange[0]);
    setToDate(releaseDateRange[1]);
  }, [releaseDateRange]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    
    onDateChange(e, 0);

    if (toDate && newFromDate > toDate) {
      setToDate(newFromDate);
      onDateChange({ target: { value: newFromDate } } as React.ChangeEvent<HTMLInputElement>, 1);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    if (newToDate === "") {
      setToDate(newToDate);
      onDateChange(e, 1);
      return;
    }
    
    setToDate(newToDate);
    onDateChange(e, 1);

    if (fromDate && newToDate < fromDate) {
      setFromDate(newToDate);
      onDateChange({ target: { value: newToDate } } as React.ChangeEvent<HTMLInputElement>, 0);
    }
  };

  return (
    <div className="space-y-4 mb-4">
    <div className="w-full flex justify-between items-center">
      <label className="block mb-1">{t('moviePage.from')}</label>
      <input 
        type="date"
        value={fromDate}
        onChange={handleFromChange}
        className="w-3/4 px-2 py-1 bg-white text-dark border-2 rounded-md focus:outline-none focus:border-primary"
      />
    </div>
    <div className="w-full flex justify-between items-center">
      <label className="block mb-1">{t('moviePage.to')}</label>
      <input 
        type="date"
        value={toDate}
        onChange={handleToChange}
        className="w-3/4 px-2 py-1 bg-white text-dark border-2 rounded-md focus:outline-none focus:border-primary"
      />
    </div>
  </div>
  );
};

export default ReleaseDateFilter;
