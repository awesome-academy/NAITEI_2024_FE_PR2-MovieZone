import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from './layout/Header';
import Footer from './layout/Footer';
import Homepage from './page/Homepage';
import AuthPage from './page/AuthPage';
import MoviePage from './page/MoviePage';
import PopulerPeoplePage from './page/PopulerPeoplePage';
import SearchPage from './page/SearchPage';
import MovieDetail from './page/MovieDetail';
import { useAlert, AlertProvider } from "./context/AlertContext";
import Alert from "./component/Alert";
import AccountPage from './page/AccountPage';
import PersonDetail from './page/PersonDetail';
import { UserListProvider } from './context/UserListContext';
import { UserProvider } from './context/UserContext';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { alert, clearAlert } = useAlert();
  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="bg-charcoal min-h-screen md:text-base text-sm flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type as any}
            onClose={clearAlert}
          />
        )}
        <UserListProvider currentLocation={location.pathname}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/movies" element={<MoviePage />} />
            <Route path="/movies/now-playing" element={<MoviePage />} />
            <Route path="/movies/upcoming" element={<MoviePage />} />
            <Route path="/movies/top-rated" element={<MoviePage />} />
            <Route path="/tv" element={<MoviePage />} />
            <Route path="/tv/airing-today" element={<MoviePage />} />
            <Route path="/tv/on-tv" element={<MoviePage />} />
            <Route path="/tv/top-rated" element={<MoviePage />} />
            <Route path="/person" element={<PopulerPeoplePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<MovieDetail />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/watchlist" element={<AccountPage />} />
            <Route path="/account/favorite" element={<AccountPage />} />
            <Route path="/account/list" element={<AccountPage />} />
            <Route path="/account/rating" element={<AccountPage />} />
            <Route path="/person/:id" element={<PersonDetail />} />
          </Routes>
        </UserListProvider>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <AlertProvider>
        <Router>
          <MainLayout />
        </Router>
      </AlertProvider>
    </UserProvider>
  );
}

export default App;
