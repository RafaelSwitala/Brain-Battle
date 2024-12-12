import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChoosePlayer from './ChoosePlayer';
import Score from './Score';
import QuizGrid from './QuizGrid';
import QuestionModal from './QuestionModal';
import spielerData from '../../../public/spieler.json';

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
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [spielerReihenfolge, setSpielerReihenfolge] = useState([]);

  useEffect(() => {
    setSpieler(spielerData);
  }, []);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch(`/erstellteQuize/${quizName}.json`);
        if (!response.ok) throw new Error("Fehler beim Laden des Quizdaten.");
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Fehler beim Laden des Quiz:", error);
      }
    };
    loadQuiz();
  }, [quizName]);

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

  const handleCellClick = (question) => {
    if (!answeredQuestions.has(question)) {
      setSelectedQuestion(question);
      setTimer(question.timer || 0);
      setIsTimerRunning(false);
      setIsContentVisible(false);
    }
  };

  const saveResults = () => {
    const results = { quizName, scores: spielerPunkte };
    alert("Ergebnisse wurden gespeichert!");
  };

  if (!quizData) return <div>Lade Quiz...</div>;

  const categorizedQuestions = {};
  quizData.questions.forEach((question) => {
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
  const sortedPoints = Object.keys(categorizedQuestions).flatMap(category => Object.keys(categorizedQuestions[category]));

  return (
    <div className='quizSpielenContainer'>
      <div className='quizSpielenQuiz'>
        {!confirmedSpieler ? (
          <ChoosePlayer
            spieler={spieler}
            selectedSpieler={selectedSpieler}
            setSelectedSpieler={setSelectedSpieler}
            handleConfirmSpieler={handleConfirmSpieler}
          />
        ) : (
          <Score
            spielerReihenfolge={spielerReihenfolge}
            spielerPunkte={spielerPunkte}
            currentSpieler={spielerReihenfolge[currentSpielerIndex]}
            saveResults={saveResults}
          />
        )}
      </div>

      <div className='quizSpielenQuiz'>
        {confirmedSpieler && (
          <>
            <QuizGrid
              categories={categories}
              sortedPoints={sortedPoints}
              handleCellClick={handleCellClick}
              answeredQuestions={answeredQuestions}
              categorizedQuestions={categorizedQuestions}
            />
            {selectedQuestion && (
              <QuestionModal
                selectedQuestion={selectedQuestion}
                timer={timer}
                isTimerRunning={isTimerRunning}
                handleTimerStart={() => setIsTimerRunning(true)}
                isContentVisible={isContentVisible}
                toggleContentVisibility={() => setIsContentVisible(!isContentVisible)}
                handleAnswerClick={(correct) => { }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizSpielen;
