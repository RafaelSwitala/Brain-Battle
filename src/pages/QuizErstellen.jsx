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
  const [pointStep, setPointStep] = useState(100); // Standardmäßig 100er Schritte
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategoryCountChange = (event) => {
    setCategoryCount(parseInt(event.target.value));
  };

  const handleRowCountChange = (event) => {
    setRowCount(parseInt(event.target.value));
  };

  const handlePointStepChange = (event) => {
    setPointStep(Number(event.target.value));
  };

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
            categoryIndex: i,  // Zu welcher Kategorie die Frage gehört
            id: `${i}-${j}`,   // Eindeutige ID für die Frage
            points: (j + 1) * pointStep,  // Punkte basierend auf Schrittgröße
            question: '',
            answer: '',
            options: []
          });
        }
      }
      setQuestions(generatedQuestions);
      setCategories(new Array(categoryCount).fill('')); // Erstelle leere Felder für die Kategorien
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

  const handleCreateJson = () => {
    const jsonData = {
      name: quizName,
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
                  className='modalInput'
                  type="text" 
                  placeholder="Gib den Namen des Quizzes ein"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)} 
                />
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
            {/* Eingabe für Kategorien */}
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

            {/* Fragen-Input pro Kategorie und Schwierigkeitslevel */}
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
                            Option hinzufügen
                          </Button>
                          {(question.options || []).map((option, idx) => (
                            <div key={idx} className="option-item">
                              <input
                                className="option-input"
                                type="text"
                                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                value={option}
                                onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
                              />
                              <Button
                                className="button-remove"
                                onClick={() => removeOptionHandler(question.id, idx)}
                              >
                                X
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>

            <Button onClick={handleCreateJson} className="mt-3">
              JSON Datei erstellen
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className='modalFooter'>
        <Button onClick={onHide}>Schließen</Button>
        {currentPage === 2 && (
          <Button onClick={() => setCurrentPage(1)}>
            Zurück
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default QuizErstellen;
