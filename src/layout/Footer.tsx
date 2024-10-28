import React from "react";
import { useTranslation } from 'react-i18next';
import logo from "../assets/image/logo2.jpg";
import facebookIcon from "../assets/icon/facebook.svg";
import twitterIcon from "../assets/icon/twitter.svg";
import instagramIcon from "../assets/icon/instagram.svg";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark text-white space-y-4">
      <div className="container max-w-screen-xl mx-auto grid md:grid-cols-4 gap-8 p-4 mt-10">
        <div className="flex flex-col items-start space-y-4">
          <a href="/">
            <img src={logo} alt="MovieZone Logo" className="w-44" />
          </a>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold mb-2 uppercase">{t('information')}</h3>
          <a href="/about" className="hover:text-primary hover:scale-105 transition">
            {t('aboutMovieZone')}
          </a>
          <a href="/privacy" className="hover:text-primary hover:scale-105 transition">
            {t('privacy')}
          </a>
          <a href="/terms" className="hover:text-primary hover:scale-105 transition">
            {t('terms')}
          </a>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold mb-2 uppercase">{t('quickLink')}</h3>
          <a href="/movies" className="hover:text-primary hover:scale-105 transition">
            {t('movies')}
          </a>
          <a href="/tv" className="hover:text-primary hover:scale-105 transition">
            {t('tvShows')}
          </a>
          <a href="/person" className="hover:text-primary hover:scale-105 transition">
            {t('popularPeople')}
          </a>
        </div>


        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold mb-2 uppercase">{t('account')}</h3>
          <a href="/account" className="hover:text-primary hover:scale-105 transition">
            {t('myAccount')}
          </a>
          <a href="/login" className="hover:text-primary hover:scale-105 transition">
            {t('login')}
          </a>
          <a href="/register" className="hover:text-primary hover:scale-105 transition">
            {t('register')}
          </a>
        </div>

      </div>
      <hr className="border-gray-700" />
      <div className="container max-w-screen-xl mx-auto text-center text-sm flex justify-between items-center p-4">
        <span className="md:text-base text-xs">© 2024 MovieZone. All Rights Reserved.</span>
        <div className="flex space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={twitterIcon} alt="Twitter" className="w-6 h-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
