import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './allPages.css';

const TestJson = ({ show, onHide }) => {

  const handleCreateJson = () => {
    const jsonData = {
      name: "Test Quiz",
      questions: [
        {
          question: "Was ist 2 + 2?",
          answer: "4"
        }
      ]
    };

    fetch('http://localhost:5000/api/save-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
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
        <Button onClick={handleCreateJson}>
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
