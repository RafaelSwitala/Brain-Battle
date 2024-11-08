import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import QuizErstellen from './QuizErstellen';

const HomePage = () => {
  const [quizFiles, setQuizFiles] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

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

          const quizDataPromises = files.map(async (file) => {
            const quizResponse = await fetch(file);
            if (quizResponse.ok) {
              const quizData = await quizResponse.json();
              return {
                name: quizData.name || file.replace('/erstellteQuize/', '').replace('.json', ''),
                timerLength: quizData.settings?.timer || 'N/A',
                wrongAnswerBehavior: quizData.settings?.incorrectAnswerBehavior || 'N/A',
                openAnswerBehavior: quizData.settings?.openOptionsBehavior || 'N/A',
                categoryCount: quizData.categories?.length || 0,
                difficultyLevels: new Set(quizData.questions.map(q => q.points)).size,
                scoreSteps: [...new Set(quizData.questions.map(q => q.points))].sort((a, b) => a - b).join(', ')
              };
            }
            return null;
          });

          const quizFilesData = (await Promise.all(quizDataPromises)).filter(data => data !== null);
          setQuizFiles(quizFilesData);
        } else {
          console.error('Error fetching files:', response.statusText);
        }
      } catch (error) {
        console.error("Error loading quiz files:", error);
      }
    };

    loadQuizFiles();
  }, []);

  const handleDeleteClick = (quizName) => {
    setQuizToDelete(quizName);
    setShowDeleteModal(true);
  };

  const confirmDeleteQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/deleteQuiz/${quizToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        setQuizFiles(prevFiles => prevFiles.filter(quiz => quiz.name !== quizToDelete));
        setShowDeleteModal(false);
        setQuizToDelete(null);
      } else {
        console.error('Error deleting quiz:', response.statusText);
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={2} className="left-column">
          <h2>Dashboard</h2>
          <div className="link-container">
            <Link to="/Spielerverwaltung" className="button-2">Spielerverwaltung</Link>
            <Link to="/Anleitungen" className="button-2">Anleitungen</Link>
            <Link to="/Ergebnisse" className="button-2">Quiz Ergebnisse</Link>

            <Button variant="primary" onClick={() => setModalShow(true)}>
              Neues Quiz erstellen
            </Button>

            <QuizErstellen
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </div>
        </Col>

        <Col xs={12} md={10} className="right-column">
          <h2>Quiz spielen</h2>
          <Table striped bordered hover variant="dark" className="quiz-table">
            <thead>
              <tr>
                <th className='spalte1'>Quizname</th>
                <th className='spalte2'>Timer</th>
                <th className='spalte3'>Falsche Antwort</th>
                <th className='spalte4'>Antwortoptionen</th>
                <th className='spalte5'>Kategorien</th>
                <th className='spalte6'>Level</th>
                <th className='spalte7'>B</th>
                <th className='spalte8'>L</th>
              </tr>
            </thead>
            <tbody>
              {quizFiles.length > 0 ? (
                quizFiles.map((quiz, index) => (
                  <tr key={index} className="quiz-row">
                    <td>
                      <Link to={`/QuizSpielen/${quiz.name}`} className="quiz-link">
                        {quiz.name}
                      </Link>
                    </td>
                    <td>{quiz.timerLength} Sekunden</td>
                    <td>{quiz.wrongAnswerBehavior}</td>
                    <td>{quiz.openAnswerBehavior}</td>
                    <td>{quiz.categoryCount}</td>
                    <td>{quiz.scoreSteps}</td>
                    <td className='bearbeitenIcon'></td>
                    <td className='loeschenIcon' onClick={() => handleDeleteClick(quiz.name)}></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Kein Quiz gefunden</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Quiz löschen</Modal.Title>
        </Modal.Header>
        <Modal.Body>Möchten Sie das Quiz "{quizToDelete}" wirklich löschen?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={confirmDeleteQuiz}>
            Löschen
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HomePage;
