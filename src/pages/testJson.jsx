import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './allPages.css';

const TestJson = ({ show, onHide }) => {
  // State für den Namen des Quizzes und die Fragen/Antworten
  const [quizName, setQuizName] = useState('');
  const [question1, setQuestion1] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [answer2, setAnswer2] = useState('');

  // Funktion zum Erstellen und Speichern der JSON-Datei auf dem Server
  const handleCreateJson = () => {
    // JSON-Daten aus den Eingaben erstellen
    const jsonData = {
      name: quizName,
      questions: [
        {
          question: question1,
          answer: answer1
        },
        {
          question: question2,
          answer: answer2
        }
      ]
    };

    // Der Name der JSON-Datei wird auf Basis des eingegebenen Quiz-Namens erstellt
    const fileName = `${quizName}.json`;

    // JSON-Daten an das Backend senden
    fetch(`http://localhost:5000/api/save-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName, jsonData })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message); // Erfolgsnachricht
      })
      .catch(error => {
        console.error('Fehler beim Speichern der Datei:', error);
      });
  };

  return (
    <Modal
      className='quizModal'
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className='modalHeader' closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Test Modal zum Erstellen einer JSON-Datei
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBody'>
        <Form>
          {/* Eingabefeld für den Namen des Quizzes */}
          <Form.Group controlId="formQuizName">
            <Form.Label>Name des Quizzes</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Gib den Namen des Quizzes ein"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)} 
            />
          </Form.Group>

          {/* Eingabefelder für Frage 1 und Antwort 1 */}
          <Form.Group controlId="formQuestion1">
            <Form.Label>Frage 1</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Gib die erste Frage ein"
              value={question1}
              onChange={(e) => setQuestion1(e.target.value)} 
            />
          </Form.Group>
          <Form.Group controlId="formAnswer1">
            <Form.Label>Antwort 1</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Gib die Antwort auf Frage 1 ein"
              value={answer1}
              onChange={(e) => setAnswer1(e.target.value)} 
            />
          </Form.Group>

          {/* Eingabefelder für Frage 2 und Antwort 2 */}
          <Form.Group controlId="formQuestion2">
            <Form.Label>Frage 2</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Gib die zweite Frage ein"
              value={question2}
              onChange={(e) => setQuestion2(e.target.value)} 
            />
          </Form.Group>
          <Form.Group controlId="formAnswer2">
            <Form.Label>Antwort 2</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Gib die Antwort auf Frage 2 ein"
              value={answer2}
              onChange={(e) => setAnswer2(e.target.value)} 
            />
          </Form.Group>
        </Form>
        <Button onClick={handleCreateJson} className="mt-3">
          JSON Datei erstellen
        </Button>
      </Modal.Body>
      <Modal.Footer className='modalFooter'>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TestJson;
