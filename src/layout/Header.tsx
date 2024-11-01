import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import logo from "../assets/image/logo.jpg";
import Dropdown from "../component/Dropdown";
import LanguageSwitcher from "../component/LanguageSwitcher";
import AvatarMenu from "../component/AvatarMenu";
import Menu from "../assets/icon/menu.svg";
import Close from "../assets/icon/close.svg";
import { UserInfo } from "../movie.type";
import { getUserInfo } from "../utils/storageHelpers";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo  | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const userData = getUserInfo();
    setUserInfo(userData);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUserInfo(null);
    window.location.href = "/";
  };

  const moviesItems = [
    { label: t('popular'), link: "/movies" },
    { label: t('nowPlaying'), link: "/movies/now-playing" },
    { label: t('upcoming'), link: "/movies/upcoming" },
    { label: t('topRated'), link: "/movies/top-rated" },
  ];

  const tvShowsItems = [
    { label: t('popular'), link: "/tv" },
    { label: t('airingToday'), link: "/tv/airing-today" },
    { label: t('onTV'), link: "/tv/on-tv" },
    { label: t('topRated'), link: "/tv/top-rated" },
  ];

  return (
    <header className="bg-dark text-white sticky top-0 z-50 font-semibold">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold text-primary">
          <a href="/">
            <img 
              src={logo} 
              alt="Logo"
              className="md:h-14 h-12 w-auto"
            />
          </a>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Dropdown label={t('movies')} items={moviesItems} />
          <Dropdown label={t('tvShows')} items={tvShowsItems} />
          <a href="/person" className="hover:text-primary transition">
            {t('popularPeople')}
          </a>
          <a href="/discuss" className="hover:text-primary transition">
            {t('discussions')}
          </a>
        </nav>

        <div className="md:hidden flex space-x-4">
          {userInfo ? (
            <AvatarMenu userInfo={userInfo} handleLogout={handleLogout} />
          ) : null}
          <button
            className={`${isMenuOpen ? "bg-primary" : "bg-gray-600"}  text-white focus:outline-none p-2 duration-300 transform`}
            onClick={toggleMenu}
          >
            {isMenuOpen ? (<img src={Close} alt="Close icon" />) : (<img src={Menu} alt="Menu icon" />)}
          </button>

        </div>

        <div
          className={`fixed inset-0 bg-charcoal bg-opacity-80 w-[60%] z-40 flex flex-col space-y-6 py-16 backdrop-blur-sm transition-transform duration-300 transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {!userInfo ? (
            <>
              <a
                className="px-4 py-2 w-5/6 mx-auto bg-primary text-white rounded hover:bg-opacity-80 transition text-center"
                href="/login"
              >
                {t("login")}
              </a>
              <a
                className="px-4 py-2 w-5/6 mx-auto border border-primary text-primary rounded hover:bg-primary hover:text-white transition text-center"
                href="/register"
              >
                {t("register")}
              </a>
            </>
          ) : null}
          <Dropdown label={t('movies')} items={moviesItems} isMobile={true} />
          <Dropdown label={t('tvShows')} items={tvShowsItems} isMobile={true} />
          <a href="/person" className="hover:text-primary transition w-5/6 mx-auto">
            {t('popularPeople')}
          </a>
          <a href="/discuss" className="hover:text-primary transition w-5/6 mx-auto">
            {t('discussions')}
          </a>
          <LanguageSwitcher isMobile={true} />
        </div>

        <div className="hidden md:flex items-center space-x-16">
          <LanguageSwitcher />

          {userInfo ? (
            <AvatarMenu userInfo={userInfo} handleLogout={handleLogout} />
          ) : (
            <div>
              <a
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-80 transition mr-3"
                href="/login"
              >
                {t("login")}
              </a>
              <a
                className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
                href="/register"
              >
                {t("register")}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
