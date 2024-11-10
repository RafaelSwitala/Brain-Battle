import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';

const EditQuizModal = ({ show, onHide, quizToEdit, quizFiles, setQuizFiles }) => {
  const [quizData, setQuizData] = useState(null);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    if (quizToEdit) {
      const selectedQuiz = quizFiles.find((quiz) => quiz.name === quizToEdit);
      if (selectedQuiz) {
        // Sicherstellen, dass categories und questions immer Arrays sind
        setQuizData(selectedQuiz);
        setEditedData({
          ...selectedQuiz,
          settings: selectedQuiz.settings || { timer: 0, incorrectAnswerBehavior: 'retry', openOptionsBehavior: 'half' },
          categories: selectedQuiz.categories || [], // Fallback zu leeren Array
          questions: selectedQuiz.questions || [], // Fallback zu leeren Array
        });
      }
    }
  }, [quizToEdit, quizFiles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        [name]: value,
      },
    }));
  };

  const handleCategoryChange = (e, index) => {
    const { value } = e.target;
    const updatedCategories = [...editedData.categories];
    updatedCategories[index] = value;
    setEditedData((prevData) => ({
      ...prevData,
      categories: updatedCategories,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/editQuiz/${quizToEdit}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
      if (response.ok) {
        setQuizFiles((prevFiles) => prevFiles.map((quiz) =>
          quiz.name === quizToEdit ? editedData : quiz
        ));
        onHide();
      } else {
        console.error('Fehler beim Speichern der Quiz-Daten');
      }
    } catch (error) {
      console.error('Fehler beim Bearbeiten des Quizzes:', error);
    }
  };

  // Sicherheitsprüfung für den Fall, dass quizData oder editedData nicht verfügbar sind
  if (!quizData || !editedData) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Quiz: "{quizToEdit}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="timer">
            <Form.Label>Timer (in Sekunden)</Form.Label>
            <Form.Control
              type="number"
              name="timer"
              value={editedData.settings.timer || 0}  // Default-Wert für timer setzen
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="incorrectAnswerBehavior">
            <Form.Label>Falsche Antwort Verhalten</Form.Label>
            <Form.Control
              as="select"
              name="incorrectAnswerBehavior"
              value={editedData.settings.incorrectAnswerBehavior || 'retry'}  // Default-Wert für incorrectAnswerBehavior setzen
              onChange={handleInputChange}
            >
              <option value="retry">Retry</option>
              <option value="skip">Skip</option>
              <option value="end">End Quiz</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="openOptionsBehavior">
            <Form.Label>Antwortoptionen Verhalten</Form.Label>
            <Form.Control
              as="select"
              name="openOptionsBehavior"
              value={editedData.settings.openOptionsBehavior || 'half'}  // Default-Wert für openOptionsBehavior setzen
              onChange={handleInputChange}
            >
              <option value="half">Half</option>
              <option value="all">All</option>
            </Form.Control>
          </Form.Group>

          <Form.Label>Kategorien</Form.Label>
          {editedData.categories.map((category, index) => (
            <Row key={index}>
              <Col>
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => handleCategoryChange(e, index)}
                />
              </Col>
            </Row>
          ))}

          <div>
            <h5>Fragen bearbeiten</h5>
            {editedData.questions.map((question, index) => (
              <div key={index}>
                <Form.Group>
                  <Form.Label>{question.category} - Frage</Form.Label>
                  <Form.Control
                    type="text"
                    value={question.question}
                    onChange={(e) => {
                      const updatedQuestions = [...editedData.questions];
                      updatedQuestions[index].question = e.target.value;
                      setEditedData((prevData) => ({
                        ...prevData,
                        questions: updatedQuestions,
                      }));
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Antwort</Form.Label>
                  <Form.Control
                    type="text"
                    value={question.answer}
                    onChange={(e) => {
                      const updatedQuestions = [...editedData.questions];
                      updatedQuestions[index].answer = e.target.value;
                      setEditedData((prevData) => ({
                        ...prevData,
                        questions: updatedQuestions,
                      }));
                    }}
                  />
                </Form.Group>
              </div>
            ))}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Änderungen speichern
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditQuizModal;
