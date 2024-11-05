import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { ReactComponent as AngleDown } from "../assets/icon/angle-downV.svg";
import { LanguageFilterProps } from "../movie.type";

const LanguageFilter: React.FC<LanguageFilterProps> = ({ originalLanguage, languages, onLanguageChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const filteredLanguages = languages.filter(language =>
    language.english_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelect = (language: string) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  const handleResetSelection = () => {
    onLanguageChange("");
    setSearchTerm("")
    setIsOpen(false);
  };
  
  useEffect(() => {
    const language = languages.find(language => language.iso_639_1 === originalLanguage)
    setSelectedLanguage(language ? language.english_name : t('moviePage.all'))
  }, [originalLanguage, languages]);


  return (
    <div className="text-dark">
      <div
        className="flex justify-between items-center p-2 cursor-pointer bg-white border-2 rounded-md hover:border-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLanguage}</span>
        <span className={`transform transition-transform ${isOpen ? "" : "-rotate-90"}`}>
          <AngleDown className="w-5 h-5" />
        </span>
      </div>
      <div className={`mt-[1px] bg-white shadow-lg origin-top transition-transform transform duration-200 border-2 rounded-md
        ${isOpen ? "scale-y-100" : "scale-y-0 max-h-0"}`}
      >
        <input
          type="text"
          placeholder={t('moviePage.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-t-md bg-white border-b-2 focus:outline-none"
        />
        <div className="max-h-60 overflow-y-auto scrollbar">
          <div
            className="p-2 cursor-pointer bg-gray-300"
            onClick={handleResetSelection}
          >
            {t('moviePage.all')}
          </div>
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((language) => (
              <div
                key={language.iso_639_1}
                className="p-2 cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => handleLanguageSelect(language.iso_639_1)}
              >
                {language.english_name}
              </div>
            ))
          ) : (
            <div className="p-2">{t('moviePage.noFound')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageFilter;
