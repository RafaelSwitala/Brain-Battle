import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './allPages.css';

const QuizErstellen = ({ show, onHide }) => {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [categoryCount, setCategoryCount] = useState(1);
  const [rowCount, setRowCount] = useState(1);
  const [pointStep, setPointStep] = useState(100);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timer, setTimer] = useState(15);
  const [incorrectAnswerBehavior, setIncorrectAnswerBehavior] = useState('none');
  const [openOptionsBehavior, setOpenOptionsBehavior] = useState('none');
  const [creationStatus, setCreationStatus] = useState('');
  const [overwriteQuiz, setOverwriteQuiz] = useState(false);

  const isQuiznameValid = (name) => {
    const regexQuizname = /^[a-zA-Z0-9_-]+$/;
    return regexQuizname.test(name) && name.length >= 3;
  };

  const handleCategoryCountChange = (event) => setCategoryCount(parseInt(event.target.value));
  const handleRowCountChange = (event) => setRowCount(parseInt(event.target.value));
  const handlePointStepChange = (event) => setPointStep(Number(event.target.value));
  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

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
            options: []
          });
        }
      }
      setQuestions(generatedQuestions);
      setCategories(new Array(categoryCount).fill(''));
      setCurrentPage(2);
    }
  };

  const handleQuestionChange = (questionId, field, value) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const addOptionHandler = (questionId) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, options: [...(q.options || []), ''] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const removeOptionHandler = (questionId, index) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, options: q.options.filter((_, i) => i !== index) };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionId, index, value) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const updatedOptions = [...q.options];
        updatedOptions[index] = value;
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
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

  const handleCreateJson = () => {
    if (!isQuiznameValid(quizName)) {
      alert("Der Quizname ist ungültig! Er darf keine Leerzeichen, Sonderzeichen oder Punkte enthalten und muss mindestens 3 Zeichen lang sein.");
      return;
    }

    const jsonData = {
      name: quizName,
      settings: {
        timer,
        incorrectAnswerBehavior,
        openOptionsBehavior
      },
      categories: categories,
      questions: questions.map(q => ({
        category: categories[q.categoryIndex],
        points: q.points,
        question: q.question,
        answer: q.answer,
        options: q.options
      }))

    };

    const fileName = `${quizName}.json`;

    fetch(`http://localhost:5000/api/save-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileName, jsonData })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
      })
      .catch(error => {
        console.error('Fehler beim Speichern der Datei:', error);
        setCreationStatus('Fehler beim Speichern der Datei');
        setCurrentPage(4);
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
          Neues Quiz Erstellen
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBody'>
        {currentPage === 1 && (
          <>
            <Form>
              <Form.Group controlId="formQuizName">
                <Form.Label className='modalText'>Name des Quizzes</Form.Label>
                <Form.Control 
                  className={`modalInput ${isQuiznameValid(quizName) ? '' : 'is-invalid'}`}
                  type="text" 
                  placeholder="Gib den Namen des Quizzes ein"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)} 
                />
                { !isQuiznameValid(quizName) && <p className="error-text">Ungültiger Quizname!</p> }
              </Form.Group>
            </Form>

            <h4 className='modalText'>Einstellungen</h4>
            <div className="quiz-settings numberCategories">
              <p className="settings-label-h1">Anzahl der Kategorien: {categoryCount}</p>
              <input
                className="settings-slider"
                type="range"
                min="2"
                max="8"
                value={categoryCount}
                onChange={handleCategoryCountChange}
              />
            </div>

            <div className="quiz-settings difficultyCategories">
              <p className="settings-label-h1">Schwierigkeitslevel pro Kategorie: {rowCount}</p>
              <input
                className="settings-slider"
                type="range"
                min="3"
                max="10"
                value={rowCount}
                onChange={handleRowCountChange}
              />
            </div>

            <div className="quiz-settings pointSteps">
              <h4 className='modalText'>Punkteschritte</h4>
              <Form.Select
                className='modalInput'
                value={pointStep}
                onChange={handlePointStepChange}
              >
                <option value={1}>1er Schritte</option>
                <option value={10}>10er Schritte</option>
                <option value={20}>20er Schritte</option>
                <option value={50}>50er Schritte</option>
                <option value={100}>100er Schritte</option>
                <option value={200}>200er Schritte</option>
                <option value={500}>500er Schritte</option>
                <option value={1000}>1000er Schritte</option>
              </Form.Select>
            </div>

            <Button className="button-1" onClick={generateQuestions}>
              Fragenfelder generieren
            </Button>
          </>
        )}

        {currentPage === 2 && (
          <>
            <div className="category-inputs">
              <h4>Kategorien eingeben:</h4>
              {categories.map((category, index) => (
                <Form.Group key={index} controlId={`category-${index}`}>
                  <Form.Label>Kategorie {index + 1}</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder={`Kategorie ${index + 1} eingeben`}
                    value={category}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                  />
                </Form.Group>
              ))}
            </div>

            <div className="question-container">
              {categories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h4 className="category-title">Kategorie: {category || `Kategorie ${catIndex + 1}`}</h4>
                  {questions
                    .filter((q) => q.categoryIndex === catIndex)
                    .map((question) => (
                      <div key={question.id} className="question-item">
                        <h5>Frage für {question.points} Punkte</h5>
                        <textarea
                          className="question-input"
                          type="text"
                          placeholder="Frage eingeben"
                          value={question.question}
                          onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                        />
                        <input
                          className="answer-input"
                          type="text"
                          placeholder="Antwort eingeben"
                          value={question.answer}
                          onChange={(e) => handleQuestionChange(question.id, 'answer', e.target.value)}
                        />
                        <div className="options-container">
                          <Button
                            className="button-secondary"
                            onClick={() => addOptionHandler(question.id)}
                          >
                            Antwortoption hinzufügen
                          </Button>
                          {question.options.map((option, index) => (
                            <div key={index} className="option-item">
                              <input
                                className="option-input"
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(question.id, index, e.target.value)}
                              />
                              <Button
                                className="button-danger"
                                onClick={() => removeOptionHandler(question.id, index)}
                              >
                                Entfernen
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>

            <Button onClick={() => setCurrentPage(3)}>Weiter zu Seite 3</Button>
          </>
        )}
        {currentPage === 3 && (
          <>
            {/* Seite 3: Weitere Einstellungen */}
            <Form.Group controlId="timer">
              <Form.Label>Timer-Dauer:</Form.Label>
              <Form.Select value={timer} onChange={(e) => setTimer(Number(e.target.value))}>
                <option value={15}>15 Sekunden</option>
                <option value={30}>30 Sekunden</option>
                <option value={45}>45 Sekunden</option>
                <option value={60}>1 Minute</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="incorrectAnswerBehavior">
              <Form.Label>Verhalten bei falscher Antwort:</Form.Label>
              <Form.Select value={incorrectAnswerBehavior} onChange={(e) => setIncorrectAnswerBehavior(e.target.value)}>
                <option value="skip">Keine Aktion - Frage wird geschlossen</option>
                <option value="retry">Erneut versuchen - 2. Versuch</option>
                <option value="minus">Minuspunkte - Punktezahl wird abziehen</option>
                <option value="buzzer">Buzzer - Andere Spieler dürfen antworten</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="openOptionsBehavior">
              <Form.Label>Verhalten beim Öffnen der Antwortmöglichkeiten</Form.Label>
              <Form.Select value={openOptionsBehavior} onChange={(e) => setOpenOptionsBehavior(e.target.value)}>
                <option value="full">Volle Punktzahl bleibt erreichbar</option>
                <option value="half">Die Punktzahl halbiert sich</option>
              </Form.Select>
            </Form.Group>
            
            <Button onClick={handleCreateJson}>Quiz erstellen</Button>
          </>
        )}

        {currentPage === 4 && (
          <>
            {/* Seite 4: Status der Erstellung */}
            <h4>{creationStatus}</h4>
            <Button onClick={onHide}>Schließen</Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QuizErstellen;
