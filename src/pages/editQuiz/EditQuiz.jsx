import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import '../allPages.css';

const EditQuiz = ({ quizData }) => {
  if (!quizData) {
    return <div>Lade Daten...</div>;
  }

  return (
    <div>
      <h3>{`Bearbeite Quiz: ${quizData.name}`}</h3>
      <p>Was möchtest du bearbeiten?</p>

      <Accordion eventKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Quiz Namen</Accordion.Header>
          <Accordion.Body>
            <p>Aktueller Name: {quizData.name}</p>
            <input 
              type="text" 
              defaultValue={quizData.name} 
              placeholder="Neuen Quiznamen eingeben" 
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Kategorien</Accordion.Header>
          <Accordion.Body>
            <p>Anzahl der Kategorien: {quizData.categoryCount}</p>
            <button>Kategorien bearbeiten</button>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Anzahl der Schwierigkeitslevel</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelle Level: {quizData.scoreSteps}</p>
            <input 
              type="text" 
              defaultValue={quizData.scoreSteps} 
              placeholder="Neue Level eingeben" 
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Punkteschritte</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelle Punkteschritte: {quizData.scoreSteps}</p>
            <input 
              type="text" 
              defaultValue={quizData.scoreSteps} 
              placeholder="Neue Punkteschritte eingeben" 
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Fragen und Antworten</Accordion.Header>
          <Accordion.Body>
            <p>Hier kannst du Fragen und Antworten bearbeiten.</p>
            <button>Fragen bearbeiten</button>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Verhalten beim Öffnen der Antwortoptionen</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelles Verhalten: {quizData.openAnswerBehavior}</p>
            <select defaultValue={quizData.openAnswerBehavior}>
              <option value="standard">Standard</option>
              <option value="random">Zufällig</option>
              <option value="alwaysOpen">Immer offen</option>
            </select>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>Verhalten bei falscher Antwort</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelles Verhalten: {quizData.wrongAnswerBehavior}</p>
            <select defaultValue={quizData.wrongAnswerBehavior}>
              <option value="retry">Wiederholen</option>
              <option value="skip">Überspringen</option>
              <option value="endQuiz">Quiz beenden</option>
            </select>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Dauer des Timers</Accordion.Header>
          <Accordion.Body>
            <p>Aktuelle Dauer: {quizData.timerLength} Sekunden</p>
            <input 
              type="number" 
              defaultValue={quizData.timerLength} 
              placeholder="Neue Timer-Dauer (in Sekunden)" 
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <button className="save-button">Speichern</button>
    </div>
  );
};

export default EditQuiz;
