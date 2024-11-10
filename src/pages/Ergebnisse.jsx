import React, { useEffect, useState } from 'react';
import './allPages.css';
import Accordion from 'react-bootstrap/Accordion';
import { Modal, Button } from 'react-bootstrap';  // Importiere Modal und Button

const Ergebnisse = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizResultToDelete, setQuizResultToDelete] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ergebnisse');
        if (!response.ok) throw new Error(`Fehler: ${response.statusText}`);
        
        const results = await response.json(); 
        setQuizResults(results);
      } catch (error) {
        console.error('Fehler beim Laden der Ergebnisse:', error);
      }
    };

    fetchResults();
  }, []);

  const handleDeleteClick = (quizName) => {
    setQuizResultToDelete(quizName);
    setShowDeleteModal(true);
  };

  const confirmDeleteQuizResult = async () => {
    try {
      const quizResultName = quizResultToDelete.replace('.json', ''); 
      const response = await fetch(`http://localhost:5000/api/deleteQuizResult/${quizResultName}`, { method: 'DELETE' });
      if (response.ok) {
        setQuizResults(prevResults => prevResults.filter(quiz => quiz.fileName !== quizResultToDelete));
        setShowDeleteModal(false);
        setQuizResultToDelete(null);
      } else {
        console.error('Error deleting quiz-results:', response.statusText);
      }
    } catch (error) {
      console.error("Error deleting quiz-results:", error);
    }
  };
  

  return (
    <div>
      <h3>Ergebnisse</h3>
      <div className='mainPage-container'>
        <Accordion className='quizErgebnisseContainer' defaultActiveKey="0">
          {quizResults.map((result, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header className="quizErgebnisseHeader">
                <span className="fileName">
                  {result.fileName.replace('.json', '')}
                </span>
                <span 
                  className="loeschenIcon loeschenIconEnde" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(result.fileName);
                  }}>
                  
                </span>
              </Accordion.Header>

              <Accordion.Body className='quizErgebnisseBody'>
                <p><strong>Datum:</strong> {result.data.date}</p>
                <p><strong>Uhrzeit:</strong> {result.data.time}</p>
                <h4>Punkte:</h4>
                <ul>
                  {Object.entries(result.data.scores).map(([name, score]) => (
                    <li key={name}>
                      {name}: {score} Punkte
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        
        {/* Delete Modal */}
        <Modal 
          className='loeschenModal'
          show={showDeleteModal} 
          onHide={() => setShowDeleteModal(false)}>
          <Modal.Header className='loeschenModalHeader' closeButton>
            <Modal.Title>Quiz-Ergebnisse löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body className='loeschenModalBody'>Möchtest Du "{quizResultToDelete}" wirklich löschen?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Abbrechen
            </Button>
            <Button variant="danger" onClick={confirmDeleteQuizResult}>
              Löschen
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Ergebnisse;
