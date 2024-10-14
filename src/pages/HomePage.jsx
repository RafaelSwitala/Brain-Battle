import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, Route, Routes } from 'react-router-dom';
import QuizErstellen from './QuizErstellen';
import QuizBearbeiten from './QuizBearbeiten';
import QuizSpielen from './QuizSpielen';
import SpielerVerwaltung from './SpielerVerwaltung';

import './allPages.css';

const HomePage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h3>Home Page Content</h3>
          <p>Was möchtest du tun? Ein neues Quiz erstellen oder ein Quiz spielen?</p>
        </Col>
      </Row>
      <Row>
        
        <Col className="left-column">
          <h2>Erstelle ein neues Spiel</h2>
          <div className="link-container">
            <Link to="/QuizErstellen" className="button-2">Quiz Erstellen</Link>
            <Link to="/QuizBearbeiten" className="button-2">Quiz Bearbeiten</Link>
            <Link to="/Spielerverwaltung" className="button-2">Spieler Verwaltung</Link>
          </div>
        </Col>

        <Col className="right-column">
          <h2>Quiz Spielen</h2>
          <Link to="/QuizSpielen" className="button-2">Quiz Spielen</Link>
        </Col>

      </Row>
      <Routes>
        <Route path="/QuizErstellen" element={<QuizErstellen />} />
        <Route path="/QuizBearbeiten" element={<QuizBearbeiten />} />
        <Route path="/QuizSpielen" element={<QuizSpielen />} />
        <Route path="/Spielerverwaltung" element={<SpielerVerwaltung />} />
      </Routes>
    </Container>
  );
};

export default HomePage;
