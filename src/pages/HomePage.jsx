import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import QuizErstellen from './QuizErstellen';

import './allPages.css';

const HomePage = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Container>
      <Row>
        <Col>
          <h3>Home Page Content</h3>
          <p>Was möchtest du tun? Ein neues Quiz erstellen oder ein Quiz spielen?</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4} className="left-column">
          <h2>Erstelle ein neues Spiel</h2>
          <div className="link-container">
            <Link to="/QuizBearbeiten" className="button-2">Quiz Bearbeiten</Link>
            <Link to="/Spielerverwaltung" className="button-2">Spieler Verwaltung</Link>

            <Button variant="primary" onClick={() => setModalShow(true)}>
              Neues Quiz Erstellen
            </Button>

            <QuizErstellen
              show={modalShow}
              onHide={() => setModalShow(false)}
            />

          </div>
        </Col>

        <Col xs={12} md={8} className="right-column"> 
          <h2>Quiz Spielen</h2>
          <Link to="/QuizSpielen" className="button-2">Quiz Spielen</Link>
        </Col>
      </Row>

    </Container>
  );
};

export default HomePage;
