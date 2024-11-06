import React from "react";
import { useTranslation } from "react-i18next";
import { AvatarMenuProps } from "../movie.type";
import useToggleVisibility from "../utils/useToggleVisibility";

const AvatarMenu: React.FC<AvatarMenuProps> = ({ userInfo, handleLogout }) => {
  const { t } = useTranslation();
  const { isOpen, toggle, elementRef } = useToggleVisibility();

  return (
    <div className="relative" ref={elementRef}>
      <button
        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"
        onClick={toggle}
      >
        {userInfo.username.charAt(0).toUpperCase()}
      </button>
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 mt-3 w-48 bg-white rounded shadow-lg transition-all duration-300 origin-top 
          ${isOpen ? "scale-y-100 opacity-100" : "opacity-0 scale-y-0"}
        `}
      >
        <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 origin-top w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>
        <a href="/account" className="block px-4 py-2 text-dark">
          <p>{userInfo.username}</p>
          <p className="text-xs text-gray-600">{t("header.viewProfile")}</p>
        </a>
        <hr />
        <a
          href="/account/watchlist"
          className="block px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-primary"
        >
          {t("header.discuss")}
        </a>
        <a
          href="/account/watchlist"
          className="block px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-primary"
        >
          {t("header.list")}
        </a>
        <a
          href="/account/ratings"
          className="block px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-primary"
        >
          {t("header.rating2")}
        </a>
        <a
          href="/account/watchlist"
          className="block px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-primary"
        >
          {t("header.watchlist")}
        </a>
        <hr />
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-white hover:bg-primary"
        >
          {t("header.logout")}
        </button>
      </div>
    </div>
  );
};

export default AvatarMenu;
