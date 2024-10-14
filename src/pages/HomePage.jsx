import React, { useState } from 'react'; // Importiere useState
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Test from './Test'; // Importiere die Test-Komponente

import './allPages.css';



const HomePage = () => {
  const [modalShow, setModalShow] = useState(false); // Zustand für das Modal

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

            <Button variant="primary" onClick={() => setModalShow(true)}>
              Launch vertically centered modal
            </Button>
            
            <Test
              show={modalShow} // Zeige das Modal basierend auf modalShow
              onHide={() => setModalShow(false)} // Schließe das Modal
            />
          </div>
        </Col>

        <Col className="right-column">
          <h2>Quiz Spielen</h2>
          <Link to="/QuizSpielen" className="button-2">Quiz Spielen</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
