import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import '../allPages.css';

const EditQuiz = ({ quizData }) => {
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    console.log('Empfangenes quizData:', quizData);
    if (quizData) {
      setQuiz({
        ...quizData,
        settings: {
          timer: quizData.settings?.timer || 0,
          incorrectAnswerBehavior: quizData.settings?.incorrectAnswerBehavior || 'minus',
          openOptionsBehavior: quizData.settings?.openOptionsBehavior || 'none',
        },
        categories: Array.isArray(quizData.categories) ? quizData.categories : [],
        questions: Array.isArray(quizData.questions) ? quizData.questions : [],
      });
    }
  }, [quizData]);
  
  

  if (!quiz || !quiz.settings) {
    return <div>Lade Daten...</div>;
  }

  const handleChange = (field, value) => {
    setQuiz((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingsChange = (field, value) => {
    setQuiz((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Neue Kategorie eingeben:');
    if (newCategory) {
      setQuiz((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: `${quiz.name}.json`,
          jsonData: quiz,
        }),
      });

      if (response.ok) {
        alert('Quiz erfolgreich gespeichert!');
      } else {
        const error = await response.json();
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern des Quiz.');
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
      alert('Es gab einen Netzwerkfehler.');
    }
  };

  return (
    <div>
      <h3>{`Bearbeite Quiz: ${quiz.name}`}</h3>
      <p>Was möchtest du bearbeiten?</p>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Quiz Namen</Accordion.Header>
          <Accordion.Body>
            <p>Aktueller Name: {quiz.name}</p>
            <input
              type="text"
              value={quiz.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Neuen Quiznamen eingeben"
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Timer</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelle Dauer: {quiz.settings.timer} Sekunden</p>
            <input
              type="number"
              value={quiz.settings.timer}
              onChange={(e) => handleSettingsChange('timer', Number(e.target.value))}
              placeholder="Neue Timer-Dauer (in Sekunden)"
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Verhalten bei falscher Antwort</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelles Verhalten: {quiz.settings.incorrectAnswerBehavior}</p>
            <select
              value={quiz.settings.incorrectAnswerBehavior}
              onChange={(e) =>
                handleSettingsChange('incorrectAnswerBehavior', e.target.value)
              }
            >
              <option value="minus">Minus Punkte</option>
              <option value="skip">Überspringen</option>
              <option value="endQuiz">Quiz beenden</option>
            </select>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Verhalten beim Öffnen der Optionen</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelles Verhalten: {quiz.settings.openOptionsBehavior}</p>
            <select
              value={quiz.settings.openOptionsBehavior}
              onChange={(e) =>
                handleSettingsChange('openOptionsBehavior', e.target.value)
              }
            >
              <option value="none">Keine Aktion</option>
              <option value="standard">Standard</option>
              <option value="random">Zufällig</option>
              <option value="alwaysOpen">Immer offen</option>
            </select>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Punkteschritte</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelle Punkteschritte: {quiz.scoreSteps}</p>
            <input
              type="text"
              value={quiz.scoreSteps}
              onChange={(e) => handleChange('scoreSteps', e.target.value)}
              placeholder="Neue Punkteschritte eingeben"
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <button className="save-button" onClick={handleSave}>
        Speichern
      </button>
    </div>
  );
};

export default EditQuiz;
