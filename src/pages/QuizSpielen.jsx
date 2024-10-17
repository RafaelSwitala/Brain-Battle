import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './allPages.css';

const QuizSpielen = () => {
  const { quizName } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [spieler, setSpieler] = useState([]);
  const [selectedSpieler, setSelectedSpieler] = useState([]);

  useEffect(() => {
    const loadSpieler = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/spieler');
        if (!response.ok) {
          throw new Error('Netzwerkantwort war nicht ok');
        }
        const data = await response.json();
        console.log("Geladene Spieler:", data);
        setSpieler(data);
      } catch (error) {
        console.error("Fehler beim Laden der Spieler:", error);
      }
    };

    loadSpieler();
  }, []);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch(`/erstellteQuize/${quizName}.json`);
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Fehler beim Laden des Quiz:", error);
      }
    };

    loadQuiz();
  }, [quizName]);

  const handleCellClick = (question) => {
    setSelectedQuestion(question);
  };

  const shuffleOptions = (options) => {
    return options.sort(() => Math.random() - 0.5);
  };

  const handleCheckboxChange = (spielerName) => {
    setSelectedSpieler(prevSelected => {
      if (prevSelected.includes(spielerName)) {
        return prevSelected.filter(name => name !== spielerName);
      } else {
        return [...prevSelected, spielerName];
      }
    });
  };

  if (!quizData) return <div>Lade Quiz...</div>;

  const categorizedQuestions = {};
  quizData.questions.forEach(question => {
    const category = question.category;
    if (!categorizedQuestions[category]) {
      categorizedQuestions[category] = {};
    }
    const points = question.points;
    if (!categorizedQuestions[category][points]) {
      categorizedQuestions[category][points] = [];
    }
    categorizedQuestions[category][points].push(question);
  });

  const categories = Object.keys(categorizedQuestions);
  const pointsSet = new Set();
  Object.values(categorizedQuestions).forEach(pointsMap => {
    Object.keys(pointsMap).forEach(point => pointsSet.add(point));
  });
  const sortedPoints = Array.from(pointsSet).sort((a, b) => a - b);

  return (
    <div className='quizSpielenContainer'>
      <div className='quizSpielenSpieler'>
      <h3>{quizData.name}</h3>
        <div className='wer-spielt-mit'>
          <div className="spieler-auswahl">
            <h4>Spieler auswählen:</h4>
            {spieler.length > 0 ? (
              spieler.map((spielerItem, index) => (
                <div key={index}>
                  <input
                    className='spielerAuswahlCheckbox'
                    type="checkbox"
                    id={`spieler-${index}`}
                    checked={selectedSpieler.includes(spielerItem)}
                    onChange={() => handleCheckboxChange(spielerItem)}
                  />
                  <label className='spielerNameLabel' htmlFor={`spieler-${index}`}>{spielerItem}</label>
                </div>
              ))
            ) : (
              <div>Keine Spieler verfügbar</div>
            )}

          </div>

          <div className="ausgewählte-spieler">
            <h4>Ausgewählte Spieler:</h4>
            <ul>
              {selectedSpieler.map((spielerName, index) => (
                <li className='spielerNameGewaehlt' key={index}>{spielerName}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <div className='quizSpielenQuiz'>
        <div className='mainPage-container'>
          <div className="grid-container" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
            {categories.map((category, index) => (
              <div key={index} className="grid-cell category-header">{category}</div>
            ))}
            {sortedPoints.map((points) => (
              <React.Fragment key={points}>
                {categories.map((category) => {
                  const questions = categorizedQuestions[category][points] || [];
                  return questions.map((question, questionIndex) => (
                    <div
                      key={`${category}-${questionIndex}`}
                      className="grid-cell"
                      onClick={() => handleCellClick(question)}>
                      {points}
                    </div>
                  ));
                })}

              </React.Fragment>
            ))}
          </div>
        </div>

        {selectedQuestion && (
          <Modal className='modal-content' show={true} onHide={() => setSelectedQuestion(null)}>
            <Modal.Header className='modalHeader' closeButton>
              <Modal.Title className='modalQuestion'>{selectedQuestion.question}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modalBody'>
              {shuffleOptions([selectedQuestion.answer, ...selectedQuestion.options]).map((option, index) => (
                <Button key={index} variant="outline-primary" className="d-block mb-2">{option}</Button>
              ))}
            </Modal.Body>
            <Modal.Footer className='modalFooter'>
              <Button variant="secondary" onClick={() => setSelectedQuestion(null)}>
                Schließen
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>



    </div>
  );
};

export default QuizSpielen;
