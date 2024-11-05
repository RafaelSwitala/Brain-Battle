import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './allPages.css';
import spielerData from '../../public/spieler.json'; 
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const QuizSpielen = () => {
  const { quizName } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [spieler, setSpieler] = useState([]); 
  const [selectedSpieler, setSelectedSpieler] = useState([]);
  const [confirmedSpieler, setConfirmedSpieler] = useState(false);
  const [spielerPunkte, setSpielerPunkte] = useState({});
  const [currentSpielerIndex, setCurrentSpielerIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [punkteAnpassen, setPunkteAnpassen] = useState(0);
  const [punkteOption, setPunkteOption] = useState('add');
  const currentSpieler = selectedSpieler[currentSpielerIndex];
  const [spielerReihenfolge, setSpielerReihenfolge] = useState([]);
  const [incorrectAnswerBehavior, setIncorrectAnswerBehavior] = useState('skip');

  useEffect(() => {
    setSpieler(spielerData);
  }, []);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch(`/erstellteQuize/${quizName}.json`);
        const data = await response.json();
        setQuizData(data);
        setIncorrectAnswerBehavior(data.settings.incorrectAnswerBehavior);
      } catch (error) {
        console.error("Fehler beim Laden des Quiz:", error);
      }
    };
  
    loadQuiz();
  }, [quizName]);
  

  const handleCellClick = (question) => {
    if (!answeredQuestions.has(question)) {
      setSelectedQuestion(question);
      setTimer(question.timer || 0);
      setIsTimerRunning(false);
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
      const shuffledSpieler = selectedSpieler.sort(() => Math.random() - 0.5);
      setSpielerReihenfolge(shuffledSpieler);
      const initialPunkte = shuffledSpieler.reduce((acc, spielerName) => {
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
    if (!selectedQuestion) {
      console.error("Selected question is null");
      return;
    }
  
    const points = selectedQuestion.points;
  
    if (isCorrect) {
      setSpielerPunkte(prevPunkte => ({
        ...prevPunkte,
        [currentSpieler]: prevPunkte[currentSpieler] + points
      }));
    } else {
      switch (incorrectAnswerBehavior) {
        case 'skip':
          break;
        case 'retry':
          alert("Versuchen Sie es erneut!"); 
          return;
        case 'minus':
          setSpielerPunkte(prevPunkte => ({
            ...prevPunkte,
            [currentSpieler]: Math.max(0, prevPunkte[currentSpieler] - points)
          }));
          break;
        default:
          console.error("Unbekanntes Verhalten bei falscher Antwort");
      }
    }
  
    setAnsweredQuestions(prevAnswered => new Set(prevAnswered).add(selectedQuestion));
    setCurrentSpielerIndex((prevIndex) => (prevIndex + 1) % selectedSpieler.length);
    setSelectedQuestion(null);
    setTimer(0);
  };
  
  
  

  const handleTimerStart = () => {
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => Math.max(prevTimer - 1, 0));
      }, 1000);
    } else if (timer === 0) {
      handleAnswerClick(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const saveResults = async () => {
    const results = {
      quizName: quizName,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scores: spielerPunkte,
    };
  
    try {
      await axios.post('http://localhost:5000/api/save-results', { quizName, results });
      alert("Ergebnisse wurden gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern der Ergebnisse:", error);
    }
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
                {spielerReihenfolge.map((spielerName, index) => (
                  <tr key={index}>
                    <td>{spielerName}</td>
                    <td>{spielerPunkte[spielerName]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Aktueller Spieler:
              <br />
               {currentSpieler}</h4>

               <div className='individuellePunkte'>
                <Form.Group controlId="individuellePunkteSpieler">
                  <Form.Label>Spieler auswählen:</Form.Label>
                  <Form.Select value={spielerReihenfolge[currentSpielerIndex]} onChange={(e) => {}}>
                    {spielerReihenfolge.map((spielerName, index) => (
                      <option key={index} value={spielerName}>
                        {spielerName}
                      </option>
                    ))}
                  </Form.Select>


                </Form.Group>

                <Form.Group controlId="punkteInput">
                  <Form.Label>Punkte anpassen:</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="Punktezahl"
                    onChange={(e) => setPunkteAnpassen(parseInt(e.target.value))}
                  />
                </Form.Group>

                <Form.Group controlId="punkteOptionen">
                  <Form.Check
                    type="radio"
                    id="pluspunkte"
                    label="Punkte hinzufügen"
                    name="punkteOptionen"
                    onChange={() => setPunkteOption('add')}
                    defaultChecked
                  />
                  <Form.Check
                    type="radio"
                    id="minuspunkte"
                    label="Punkte abziehen"
                    name="punkteOptionen"
                    onChange={() => setPunkteOption('subtract')}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={() => {
                    if (currentSpieler && !isNaN(punkteAnpassen)) {
                      setSpielerPunkte((prevPunkte) => ({
                        ...prevPunkte,
                        [currentSpieler]: Math.max(
                          0,
                          prevPunkte[currentSpieler] + (punkteOption === 'add' ? punkteAnpassen : -punkteAnpassen)
                        )
                      }));
                    }
                  }}
                >
                  Punkte aktualisieren
                </Button>
              </div>


                <Button variant="danger" onClick={saveResults}>
                 Quiz beenden
                </Button>

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
              <Modal className='quizModal' show={true} onHide={() => setSelectedQuestion(null)}>
                <Modal.Header className='modalHeader' closeButton>
                  <Modal.Title className='modalQuestion'>
                    <small>{selectedQuestion.category} - {selectedQuestion.points} Punkte</small>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                  {selectedQuestion.question} <br />
                  <h5>Zeit verbleibend: {timer} Sekunden</h5>
                    {!isTimerRunning && <Button className='timerButton' onClick={handleTimerStart}>Start Timer</Button>}

                    <Button
                      className='beantwortenButton richtigButton'
                      onClick={() => handleAnswerClick(true)}
                    >
                      Richtig
                    </Button>

                    <Button
                      className='beantwortenButton falschButton'
                      onClick={() => handleAnswerClick(false)}
                    >
                      Falsch
                    </Button>

                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Antwortmöglichkeiten</Accordion.Header>
                        <Accordion.Body>
                          {shuffleOptions([selectedQuestion.answer, ...selectedQuestion.options]).map((option, index) => (
                          <Button 
                            key={index} 
                            variant="outline-primary" 
                            className="d-block mb-2" 
                            onClick={() => handleAnswerClick(option === selectedQuestion.answer)}
                          >
                            {option}
                          </Button>
                        ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                </Modal.Body>
                <Modal.Footer className='modalFooter'>
                  
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
