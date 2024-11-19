import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './allPages.css';

import QuizSettings from './QuizSettings';
import CategoryInput from './CategoryInput';
import QuestionEditor from './QuestionEditor';
import FinalSettings from './FinalSettings';

const QuizErstellen = ({ show, onHide }) => {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCount, setCategoryCount] = useState(2);
  const [rowCount, setRowCount] = useState(3);
  const [pointStep, setPointStep] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [timer, setTimer] = useState(15);
  const [incorrectAnswerBehavior, setIncorrectAnswerBehavior] = useState('none');
  const [openOptionsBehavior, setOpenOptionsBehavior] = useState('none');
  const [creationStatus, setCreationStatus] = useState('');
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);

  // Validierungsfunktionen
  const isQuiznameValid = (name) => /^[a-zA-Z0-9_-]+$/.test(name) && name.length >= 3;

  const areAllCategoriesFilled = () => categories.every((category) => category.trim() !== '');

  const generateQuestions = () => {
    if (categoryCount && rowCount && pointStep) {
      const generatedQuestions = [];
      for (let i = 0; i < categoryCount; i++) {
        for (let j = 0; j < rowCount; j++) {
          generatedQuestions.push({
            categoryIndex: i,
            id: `${i}-${j}`,
            points: (j + 1) * pointStep,
            question: '',
            answer: '',
            options: [],
          });
        }
      }
      setQuestions(generatedQuestions);
      setCategories(new Array(categoryCount).fill(''));
      setCurrentPage(2);
    }
  };

  const checkQuizNameExists = async (name) => {
    try {
      const response = await fetch(`http://localhost:5000/api/check-quiz-name/${name}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Fehler beim Überprüfen des Quiznamens:', error);
      return false;
    }
  };

  const saveQuizData = () => {
    const jsonData = {
      name: quizName,
      settings: {
        timer,
        incorrectAnswerBehavior,
        openOptionsBehavior,
      },
      categories,
      questions: questions.map((q) => ({
        category: categories[q.categoryIndex],
        points: q.points,
        question: q.question,
        answer: q.answer,
        options: q.options,
      })),
    };

    const fileName = `${quizName}.json`;

    fetch(`http://localhost:5000/api/save-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, jsonData }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setCreationStatus('Quiz erfolgreich gespeichert!');
      })
      .catch((error) => {
        console.error('Fehler beim Speichern der Datei:', error);
        setCreationStatus('Fehler beim Speichern der Datei');
      });
  };

  const handleCreateJson = async () => {
    if (!isQuiznameValid(quizName)) {
      alert(
        'Der Quizname ist ungültig! Er darf keine Leerzeichen, Sonderzeichen oder Punkte enthalten und muss mindestens 3 Zeichen lang sein.'
      );
      return;
    }

    const nameExists = await checkQuizNameExists(quizName);

    if (nameExists) {
      setShowOverwriteDialog(true);
    } else {
      saveQuizData();
    }
  };

  const handleOverwriteConfirm = () => {
    setShowOverwriteDialog(false);
    saveQuizData();
  };

  const handleRenameQuiz = () => {
    setQuizName('');
    setShowOverwriteDialog(false);
  };

  return (
    <Modal
      className="quizModal quizErstellenModal"
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="modalHeader" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Neues Quiz Erstellen
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        {currentPage === 1 && (
          <QuizSettings
            quizName={quizName}
            setQuizName={setQuizName}
            isQuiznameValid={isQuiznameValid}
            categoryCount={categoryCount}
            setCategoryCount={setCategoryCount}
            rowCount={rowCount}
            setRowCount={setRowCount}
            pointStep={pointStep}
            setPointStep={setPointStep}
            generateQuestions={generateQuestions}
          />
        )}
        {currentPage === 2 && (
          <div>
            <CategoryInput
              categories={categories}
              setCategories={setCategories}
              areAllCategoriesFilled={areAllCategoriesFilled}
            />
            <QuestionEditor
              questions={questions}
              setQuestions={setQuestions}
              categoryIndex={categories.findIndex((c) => c.trim() !== '')} // Beispielhafter Index
              rowsPerCategory={rowCount}
            />
          </div>
        )}
        {currentPage === 3 && (
          <FinalSettings
            timer={timer}
            setTimer={setTimer}
            incorrectAnswerBehavior={incorrectAnswerBehavior}
            setIncorrectAnswerBehavior={setIncorrectAnswerBehavior}
            openOptionsBehavior={openOptionsBehavior}
            setOpenOptionsBehavior={setOpenOptionsBehavior}
          />
        )}
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        {currentPage === 1 && (
          <Button className="button-1" onClick={generateQuestions}>
            Fragenfelder generieren
          </Button>
        )}
        {currentPage === 2 && (
          <>
            <Button
              className="button-secondary"
              onClick={() => setCurrentPage(1)}
            >
              Zurück zu Seite 1
            </Button>
            <Button
              className="button-secondary weiterButton"
              onClick={() => setCurrentPage(3)}
              disabled={!areAllCategoriesFilled()}
            >
              Weiter zu Seite 3
            </Button>
          </>
        )}
        {currentPage === 3 && (
          <>
            <Button
              className="button-secondary"
              onClick={() => setCurrentPage(2)}
            >
              Zurück zu Seite 2
            </Button>
            <Button
              className="button-secondary weiterButton"
              onClick={handleCreateJson}
            >
              Quiz erstellen
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default QuizErstellen;
