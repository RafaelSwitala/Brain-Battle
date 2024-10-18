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
  const [confirmedSpieler, setConfirmedSpieler] = useState(false);
  const [spielerPunkte, setSpielerPunkte] = useState({});
  const [currentSpielerIndex, setCurrentSpielerIndex] = useState(0); // Aktueller Spieler
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Beantwortete Fragen

  useEffect(() => {
    const loadSpieler = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/spieler');
        if (!response.ok) {
          throw new Error('Netzwerkantwort war nicht ok');
        }
        const data = await response.json();
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
    if (!answeredQuestions.has(question)) {
      setSelectedQuestion(question); // Frage wird nur ausgewählt, wenn sie noch nicht beantwortet wurde
    }
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

  const handleConfirmSpieler = () => {
    if (selectedSpieler.length > 0) {
      const initialPunkte = selectedSpieler.reduce((acc, spielerName) => {
        acc[spielerName] = 0;
        return acc;
      }, {});
      setSpielerPunkte(initialPunkte);
      setConfirmedSpieler(true);
    } else {
      alert("Bitte mindestens einen Spieler auswählen!");
    }
  };

  const handleAnswerClick = (isCorrect) => {
    const currentSpieler = selectedSpieler[currentSpielerIndex];
    const points = selectedQuestion.points;

    setSpielerPunkte(prevPunkte => ({
      ...prevPunkte,
      [currentSpieler]: prevPunkte[currentSpieler] + (isCorrect ? points : -points)
    }));

    // Frage wird als beantwortet markiert
    setAnsweredQuestions(prevAnswered => new Set([...prevAnswered, selectedQuestion]));

    // Nächster Spieler ist dran
    setCurrentSpielerIndex((prevIndex) => (prevIndex + 1) % selectedSpieler.length);

    // Modal schließen
    setSelectedQuestion(null);
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

  const currentSpieler = selectedSpieler[currentSpielerIndex];

  return (
    <div className='quizSpielenContainer'>
      {!confirmedSpieler ? (
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
              <Button variant="primary" onClick={handleConfirmSpieler}>
                Mit ausgewählten Spielern spielen
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="tabelle-container">
            <h3>Spielstand</h3>
            <table className="spieler-tabelle">
              <thead>
                <tr>
                  <th>Spieler</th>
                  <th>Punktzahl</th>
                </tr>
              </thead>
              <tbody>
                {selectedSpieler.map((spielerName, index) => (
                  <tr key={index}>
                    <td>{spielerName}</td>
                    <td>{spielerPunkte[spielerName]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Aktueller Spieler: {currentSpieler}</h4>
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
                          className={`grid-cell ${answeredQuestions.has(question) ? 'answered' : ''}`}
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
                    <Button key={index} variant="outline-primary" className="d-block mb-2" onClick={() => handleAnswerClick(option === selectedQuestion.answer)}>
                      {option}
                    </Button>
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
        </>
      )}
    </div>
  );
};

export default QuizSpielen;
