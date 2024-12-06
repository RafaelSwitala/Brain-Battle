import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../allPages.css';

const QuestionEditor = ({ 
  questions, 
  setQuestions, 
  categoryIndex, 
  rowsPerCategory 
}) => {
  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions.find(
      (q) => q.categoryIndex === categoryIndex && q.id === `${categoryIndex}-${questionIndex}`
    );
    if (question) {
      question[field] = value;
      setQuestions(updatedQuestions);
    }
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions.find(
      (q) => q.categoryIndex === categoryIndex && q.id === `${categoryIndex}-${questionIndex}`
    );
    if (question) {
      question.options = question.options || [];
      question.options.push('');
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions.find(
      (q) => q.categoryIndex === categoryIndex && q.id === `${categoryIndex}-${questionIndex}`
    );
    if (question && question.options) {
      question.options[optionIndex] = value;
      setQuestions(updatedQuestions);
    }
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions.find(
      (q) => q.categoryIndex === categoryIndex && q.id === `${categoryIndex}-${questionIndex}`
    );
    if (question && question.options) {
      question.options.splice(optionIndex, 1);
      setQuestions(updatedQuestions);
    }
  };

  return (
    <div>
      <h4>Fragen für Kategorie {categoryIndex + 1}</h4>
      {Array.from({ length: rowsPerCategory }).map((_, questionIndex) => {
        const question = questions.find(
          (q) => q.categoryIndex === categoryIndex && q.id === `${categoryIndex}-${questionIndex}`
        );

        return (
          <div key={questionIndex} className="question-editor">
            <Form.Group controlId={`question-${categoryIndex}-${questionIndex}`}>
              <Form.Label>Frage {questionIndex + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Frage eingeben"
                value={question?.question || ''}
                onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId={`answer-${categoryIndex}-${questionIndex}`}>
              <Form.Label>Richtige Antwort</Form.Label>
              <Form.Control
                type="text"
                placeholder="Antwort eingeben"
                value={question?.answer || ''}
                onChange={(e) => handleQuestionChange(questionIndex, 'answer', e.target.value)}
              />
            </Form.Group>
            <div className="options-section">
              <h5>Optionen</h5>
              {question?.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="option-input">
                  <Form.Control
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(questionIndex, optionIndex, e.target.value)
                    }
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                  >
                    Entfernen
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={() => handleAddOption(questionIndex)}
              >
                Option hinzufügen
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionEditor;
