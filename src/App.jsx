import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateQuiz from './pages/createQuiz/CreateQuiz';
import QuizSpielen from './pages/playQuiz/QuizSpielen';
import SpielerVerwaltung from './pages/SpielerVerwaltung';
import Anleitungen from './pages/Anleitungen';
import Ergebnisse from './pages/Ergebnisse';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <div className='navBar-container'>
        <NavBar />
      </div>
      <div className='body-container'>
        <div className='mainPage-container'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/CreateQuiz" element={<CreateQuiz />} />
            <Route path="/QuizSpielen/:quizName" element={<QuizSpielen />} />
            <Route path="/Spielerverwaltung" element={<SpielerVerwaltung />} />
            <Route path="/Anleitungen" element={<Anleitungen />} />
            <Route path="/Ergebnisse" element={<Ergebnisse />} />
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