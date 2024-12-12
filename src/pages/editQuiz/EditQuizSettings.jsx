import React from "react";
import Accordion from "react-bootstrap/Accordion";

const EditQuizSettings = ({ quiz, handleChange, handleSettingsChange }) => {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Quiz Namen</Accordion.Header>
        <Accordion.Body>
          <input
            type="text"
            value={quiz.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Neuen Quiznamen eingeben"
          />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1">
        <Accordion.Header>Timer</Accordion.Header>
        <Accordion.Body>
          <input
            type="number"
            value={quiz.settings.timer}
            onChange={(e) =>
              handleSettingsChange("timer", parseInt(e.target.value, 10) || 0)
            }
            placeholder="Neue Timer-Dauer (in Sekunden)"
          />
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="2">
        <Accordion.Header>Verhalten bei falscher Antwort</Accordion.Header>
        <Accordion.Body>
          <select
            value={quiz.settings.incorrectAnswerBehavior}
            onChange={(e) =>
              handleSettingsChange("incorrectAnswerBehavior", e.target.value)
            }
          >
            <option value="minus">Minus Punkte</option>
            <option value="skip">Kein Punktabzug</option>
            <option value="retry">Erneut Versuchen</option>
          </select>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="3">
        <Accordion.Header>Verhalten beim Öffnen der Optionen</Accordion.Header>
        <Accordion.Body>
          <select
            value={quiz.settings.openOptionsBehavior}
            onChange={(e) =>
              handleSettingsChange("openOptionsBehavior", e.target.value)
            }
          >
            <option value="none">Keine Aktion</option>
            <option value="full">Volle Punktzahl</option>
            <option value="half">Halbe Punktzahl</option>
          </select>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default EditQuizSettings;
