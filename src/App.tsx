import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
  return (
    <div className="bg-charcoal min-h-screen md:text-base text-sm flex flex-col">
      <Header />
      <main className="flex-grow"></main>
      <Footer />
    </div>
  );
}

export default App;
