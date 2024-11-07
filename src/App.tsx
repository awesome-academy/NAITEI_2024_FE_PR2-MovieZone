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
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/tv" element={<MoviePage />} />
          <Route path="/person" element={<PopulerPeoplePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tv/:id" element={<MovieDetail />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AlertProvider>
      <Router>
        <MainLayout />
      </Router>
    </AlertProvider>
  );
}

export default App;
