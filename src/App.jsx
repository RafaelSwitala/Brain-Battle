import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ChallengeYourCategories from './pages/ChallengeYourCategories';


import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <div className='navBar-container'>
        <NavBar />
        </div>
      <div className='header-container'>
        <Header />
      </div>
      <div className='body-container'>
        <div className='mainPage-container'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ChallengeYourCategories" element={<ChallengeYourCategories />} />
          </Routes>
        </div>
      </div>
      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  );
};

export default App;
