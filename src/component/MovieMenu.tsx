import React from "react";
import { useTranslation } from 'react-i18next';
import { MovieMenuProps } from "../movie.type";
import { ReactComponent as ListIcon } from "../assets/icon/list.svg";
import { ReactComponent as HeartIcon } from "../assets/icon/heart.svg";
import { ReactComponent as BookmarkIcon } from "../assets/icon/bookmark.svg";
import { ReactComponent as StarIcon } from "../assets/icon/star.svg";
import { ReactComponent as EllipsisIcon } from "../assets/icon/ellipsis.svg";

const MovieMenu: React.FC<MovieMenuProps> = ({ isOpen, toggleMenu, position="right" }) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="p-1 rounded-full bg-gray-100 opacity-60 text-white hover:bg-gray-500 focus:outline-none"
      >
        <EllipsisIcon className="w-5 h-5" />
      </button>

      <div
        className={`absolute ${position === "right"? "right-0" : "left-0"} mt-2 w-auto max-w-xs bg-white shadow-lg rounded-lg z-10 transition-all duration-300 transform origin-top ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
      >
        <ul className="text-sm text-gray-700">
          <li className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2 group whitespace-nowrap rounded-t-lg">
            <ListIcon className="w-5 h-5 fill-black group-hover:fill-white" /> {t('home.addToList')}
          </li>
          <li className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2 group whitespace-nowrap">
            <HeartIcon className="w-5 h-5 fill-black group-hover:fill-white" /> {t('home.favorite')}
          </li>
          <li className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2 group whitespace-nowrap">
            <BookmarkIcon className="w-5 h-5 fill-black group-hover:fill-white" /> {t('home.watchlist')}
          </li>
          <li className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center gap-2 group whitespace-nowrap rounded-b-lg">
            <StarIcon className="w-5 h-5 fill-black group-hover:fill-white" /> {t('home.rating2')}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MovieMenu;
