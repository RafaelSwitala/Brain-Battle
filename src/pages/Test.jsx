import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import './allPages.css';
import spielerData from '../../public/spieler.json';

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
  const [openOptionsRequested, setOpenOptionsRequested] = useState(false);

  const currentSpieler = selectedSpieler[currentSpielerIndex];
  const incorrectAnswerBehavior = quizData?.settings?.incorrectAnswerBehavior;
  const openOptionsBehavior = quizData?.settings?.openOptionsBehavior;

  useEffect(() => {
    setSpieler(spielerData);
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
      setSelectedQuestion(question);
      setTimer(question.timer || 0);
      setIsTimerRunning(false);
    }
  };

  const handleAnswerClick = (isCorrect) => {
    if (!selectedQuestion) return;

    const points = selectedQuestion.points;
    let scoreChange = points;

    if (openOptionsRequested && openOptionsBehavior === "half") {
      scoreChange = Math.floor(points / 2);
    }

    setSpielerPunkte(prevPunkte => ({
      ...prevPunkte,
      [currentSpieler]: prevPunkte[currentSpieler] + (isCorrect ? scoreChange : -scoreChange)
    }));

    if (!isCorrect && incorrectAnswerBehavior === "retry") {
      return;
    } else {
      setAnsweredQuestions(prevAnswered => new Set([...prevAnswered, selectedQuestion]));
      setSelectedQuestion(null);
      setTimer(0);
      setCurrentSpielerIndex((prevIndex) => (prevIndex + 1) % selectedSpieler.length);
    }
  };

  const handleIncorrectAnswer = () => {
    if (incorrectAnswerBehavior === "minus") {
      handleAnswerClick(false);
    } else if (incorrectAnswerBehavior === "skip") {
      setAnsweredQuestions(prev => new Set([...prev, selectedQuestion]));
      setSelectedQuestion(null);
    }
  };

  const handleTimerStart = () => {
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer(prev => Math.max(prev - 1, 0)), 1000);
    } else if (timer === 0) {
      handleIncorrectAnswer();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const shuffleOptions = (options) => options.sort(() => Math.random() - 0.5);

  return (
    <div className='quizSpielenContainer'>
      {quizData ? (
        <>
          <div className='spielstand'>
            <h3>Aktueller Spieler: {currentSpieler}</h3>
            <Button variant="primary" onClick={saveResults}>Quiz beenden</Button>
          </div>
          
          {selectedQuestion && (
            <Modal show={true} onHide={() => setSelectedQuestion(null)}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedQuestion.category} - {selectedQuestion.points} Punkte</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>{selectedQuestion.question}</p>
                <h5>Zeit verbleibend: {timer} Sekunden</h5>
                {!isTimerRunning && <Button onClick={handleTimerStart}>Start Timer</Button>}
                <div className='antwort-buttons'>
                  <Button variant="success" onClick={() => handleAnswerClick(true)}>Richtig</Button>
                  <Button variant="danger" onClick={() => handleIncorrectAnswer()}>Falsch</Button>
                </div>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Antwortmöglichkeiten</Accordion.Header>
                    <Accordion.Body>
                      {shuffleOptions([selectedQuestion.answer, ...selectedQuestion.options]).map((option, idx) => (
                        <Button
                          key={idx}
                          variant="outline-primary"
                          className="d-block mb-2"
                          onClick={() => {
                            setOpenOptionsRequested(true);
                            handleAnswerClick(option === selectedQuestion.answer);
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="warning" disabled>Buzzer</Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      ) : (
        <div>Lade Quiz...</div>
      )}
    </div>
  );
};

export default QuizSpielen;
