import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './layout/Header';
import Footer from './layout/Footer';
import Homepage from './page/Homepage';

function App() {
  return (
    <div className="bg-charcoal min-h-screen md:text-base text-sm flex flex-col">
      <Header />
      <main className="flex-grow">
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;
