import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import QuizErstellen from './pages/QuizErstellen';
import QuizBearbeiten from './pages/QuizBearbeiten';
import QuizSpielen from './pages/QuizSpielen';
import SpielerVerwaltung from './pages/SpielerVerwaltung';
import Anleitungen from './pages/Anleitungen'; // Anleitungen-Komponente importieren

import 'bootstrap/dist/css/bootstrap.min.css';
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
            <Route path="/QuizErstellen" element={<QuizErstellen />} />
            <Route path="/QuizBearbeiten" element={<QuizBearbeiten />} />
            <Route path="/QuizSpielen/:quizName" element={<QuizSpielen />} />
            <Route path="/Spielerverwaltung" element={<SpielerVerwaltung />} />
            <Route path="/Anleitungen" element={<Anleitungen />} /> {/* Route für Anleitungen hinzufügen */}
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
