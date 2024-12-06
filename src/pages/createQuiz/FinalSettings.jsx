import React from 'react';
import Form from 'react-bootstrap/Form';
import '../allPages.css';

const FinalSettings = ({
  timer,
  setTimer,
  incorrectAnswerBehavior,
  setIncorrectAnswerBehavior,
  openOptionsBehavior,
  setOpenOptionsBehavior,
}) => {
  return (
    <>
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
        <Form.Select
          value={incorrectAnswerBehavior}
          onChange={(e) => setIncorrectAnswerBehavior(e.target.value)}
        >
          <option value="none">Kein Punktabzug</option>
          <option value="minus">Punkte abziehen</option>
          <option value="end">Quiz beenden</option>
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="openOptionsBehavior">
        <Form.Label>Verhalten beim öffnen der Antwortmöglichkeiten:</Form.Label>
        <Form.Select
          value={openOptionsBehavior}
          onChange={(e) => setOpenOptionsBehavior(e.target.value)}
        >
          <option value="full">Volle Punktzahl möglich</option>
          <option value="half">Halbe Punktzahl</option>
        </Form.Select>
      </Form.Group>
    </>
  );
};

export default FinalSettings;
