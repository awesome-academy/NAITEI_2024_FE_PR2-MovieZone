import React from "react";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcherProps } from "../movie.type";
import enFlag from "../assets/image/en.jpg";
import viFlag from "../assets/image/vi.png";
import angleDown from "../assets/icon/angle-down.svg";
import angleRight from "../assets/icon/angle-right.svg";
import useToggleVisibility from "../utils/useToggleVisibility";

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isMobile = false }) => {
  const { i18n } = useTranslation();
  const language = localStorage.getItem("language") || "vi";
  const { isOpen, setIsOpen, toggle, elementRef } = useToggleVisibility();

  const handleLanguageChange = (lang: string) => {
    localStorage.setItem("language", lang)
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div 
      className={`relative ${isMobile ? "w-5/6 mx-auto" : "" }`}
      ref={elementRef}
    >
      <button
        onClick={toggle}
        className="flex items-center space-x-2 hover:text-primary transition"
      >
        <img
          src={language === "en" ? enFlag : viFlag}
          alt={language}
          className="w-6 h-6 rounded-full"
        />
        {isMobile ?
          (<img src={angleRight} alt="Angle Right" />)
          :
          (<img src={angleDown} alt="Angle Down" />)
        }
      </button>

      <div
        className={`absolute mt-2 w-32 bg-white text-dark shadow-lg rounded-md transition-all duration-300 
          ${isMobile 
            ? "translate-x-14 -translate-y-5 origin-left scale-x-0" 
            : "-translate-x-8 -translate-y-2 origin-top scale-y-0"}
          ${isOpen ? "scale-x-100 scale-y-100 opacity-100" : "opacity-0"}
        `}
      >
        <a
          onClick={() => handleLanguageChange("vi")}
          className="flex items-center px-3 py-2 hover:bg-primary hover:text-white cursor-pointer rounded-t-md"
        >
          <img src={viFlag} alt="VI" className="w-5 h-5 rounded-full mr-2" />
          Tiếng Việt
        </a>
        <a
          onClick={() => handleLanguageChange("en")}
          className="flex items-center px-3 py-2 hover:bg-primary hover:text-white cursor-pointer rounded-b-md"
        >
          <img src={enFlag} alt="EN" className="w-5 h-5 rounded-full mr-2" />
          English
        </a>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
