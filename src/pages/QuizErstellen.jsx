import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './allPages.css';

const QuizErstellen = ({ show, onHide }) => {
  const [questions, setQuestions] = useState([]);
  const [categoryCount, setCategoryCount] = useState(1);
  const [rowCount, setRowCount] = useState(1);

  const handleCategoryCountChange = (event) => {
    setCategoryCount(event.target.value);
  };

  const handleRowCountChange = (event) => {
    setRowCount(event.target.value);
  };

  const generateQuestions = () => {
    if (categoryCount && rowCount) {
      const generatedQuestions = [];
      for (let i = 0; i < categoryCount; i++) {
        for (let j = 0; j < rowCount; j++) {
          generatedQuestions.push({
            id: i * rowCount + j,
            questionNumber: i * rowCount + j + 1,
          });
        }
      }
      setQuestions(generatedQuestions);
    }
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
        <h4>Einstellungen</h4>
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

        <Button className="button-1" onClick={generateQuestions}>
          Generate Questions
        </Button>

        <div className="question-container">
          {questions.map((question) => (
            <div key={question.id} className="question-item">
              <h4 className="question-number">Question {question.questionNumber}</h4>
              <input className="question-input" type="text" placeholder="Question" />
              <div className="options-container">
                <Button
                  className="button-secondary"
                  onClick={() => addOptionHandler(question.id)}
                >
                  Add Option
                </Button>
                {(question.options || []).map((_, index) => (
                  <div key={index} className="option-item">
                    <input className="option-input" type="text" placeholder={`Option ${String.fromCharCode(65 + index)}`} />
                    <Button
                      className="button-remove"
                      onClick={() => removeOptionHandler(question.id, index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
              <input className="points-input" type="text" placeholder="Points" />
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className='modalFooter'>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuizErstellen;
