import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './allPages.css';

const QuizSettings = ({
  quizName,
  handleQuizNameChange,
  isQuiznameValid,
  categoryCount,
  setCategoryCount,
  rowCount,
  setRowCount,
  pointStep,
  setPointStep,
  generateQuestions,
}) => {
  return (
    <>
      <Form>
        <Form.Group controlId="formQuizName">
          <Form.Label>Name des Quizzes</Form.Label>
          <Form.Control
            type="text"
            placeholder="Gib den Namen des Quizzes ein"
            value={quizName}
            onChange={handleQuizNameChange}
            className={isQuiznameValid(quizName) ? '' : 'is-invalid'}
          />
        </Form.Group>
      </Form>
      <h4>Einstellungen</h4>
      <div>
        <p>Anzahl der Kategorien: {categoryCount}</p>
        <input
          type="range"
          min="2"
          max="8"
          value={categoryCount}
          onChange={(e) => setCategoryCount(Number(e.target.value))}
        />
      </div>
      <div>
        <p>Schwierigkeitslevel pro Kategorie: {rowCount}</p>
        <input
          type="range"
          min="3"
          max="10"
          value={rowCount}
          onChange={(e) => setRowCount(Number(e.target.value))}
        />
      </div>
      <div>
        <h4>Punkteschritte</h4>
        <Form.Select
          value={pointStep}
          onChange={(e) => setPointStep(Number(e.target.value))}
        >
          {[1, 10, 20, 50, 100, 200, 500, 1000].map((step) => (
            <option key={step} value={step}>{`${step}-er Schritte`}</option>
          ))}
        </Form.Select>
      </div>
      <Button onClick={generateQuestions}>Fragenfelder generieren</Button>
    </>
  );
};

export default QuizSettings;
