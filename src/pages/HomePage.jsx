import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import QuizErstellen from './QuizErstellen';
import Anleitungen from './Anleitungen';
import './allPages.css';

const HomePage = () => {
  const [modalShow, setModalShow] = useState(false);
  const [quizFiles, setQuizFiles] = useState([]);

  useEffect(() => {
    const loadQuizFiles = async () => {
      try {
        const response = await fetch('/erstellteQuize');
        if (response.ok) {
          const directoryText = await response.text();
          const parser = new DOMParser();
          const htmlDocument = parser.parseFromString(directoryText, 'text/html');
          const links = Array.from(htmlDocument.querySelectorAll('a'));

          const files = links
            .map(link => link.getAttribute('href'))
            .filter(file => file.endsWith('.json'));

          const quizNames = files.map(file => 
            file.replace('/erstellteQuize/', '').replace('.json', '')
          );
          setQuizFiles(quizNames);
        } else {
          console.error('Fehler beim Abrufen der Dateien:', response.statusText);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Quiz-Dateien:", error);
      }
    };

    loadQuizFiles();
  }, []);

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
            <Link to="/Anleitungen" className="button-2">Anleitungen</Link>

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
          <div className="quiz-list">
            {quizFiles.length > 0 ? (
              quizFiles.map((quizName, index) => (
                <Link to={`/QuizSpielen/${quizName}`} key={index}>
                  <p className="quiz-name">{quizName}</p>
                </Link>
              ))
            ) : (
              <p>Keine Quize gefunden</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
