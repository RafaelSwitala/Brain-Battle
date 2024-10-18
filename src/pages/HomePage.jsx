import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import QuizErstellen from './QuizErstellen';
import Modal from 'react-bootstrap/Modal';
import './allPages.css';

const HomePage = () => {
  const [modalShow, setModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [quizFiles, setQuizFiles] = useState([]);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [quizToDelete, setQuizToDelete] = useState(null);

  // Laden der Quiz-Dateien
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

  const handleDeleteQuiz = async (quizName) => {
    try {
      console.log("Löschen von Quiz:", quizName);
  
      const response = await fetch(`http://localhost:5000/api/delete-quiz/${quizName}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      const message = await response.text();
      console.log(message);
  
      setQuizFiles(quizFiles.filter(quiz => quiz !== quizName));
      setDeleteModalShow(false);

    } catch (error) {
      console.error('Fehler beim Löschen:', error.message);
    }
  };

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
          <div className="quiz-list">
            {quizFiles.length > 0 ? (
              quizFiles.map((quizName, index) => (
                <div key={index} className="quiz-item">
                  <Link to={`/QuizSpielen/${quizName}`}>
                    <p className="quiz-name">{quizName}</p>
                  </Link>
                  <Button
                    variant="secondary"
                    className="edit-btn"
                    onClick={() => {
                      setQuizToEdit(quizName);
                      setModalShow(true);
                    }}
                  >
                    B
                  </Button>
                  <Button
                    variant="danger"
                    className="delete-btn"
                    onClick={() => {
                      setQuizToDelete(quizName);
                      setDeleteModalShow(true);
                    }}
                  >
                    L
                  </Button>
                </div>
              ))
            ) : (
              <p>Keine Quize gefunden</p>
            )}
          </div>
        </Col>
      </Row>

      <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Quiz löschen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bist du sicher, dass du das Quiz "{quizToDelete}" löschen möchtest?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModalShow(false)}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={() => {
            if (quizToDelete) handleDeleteQuiz(quizToDelete);
          }}>
            Löschen
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HomePage;
