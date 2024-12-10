import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "../allPages.css";

const EditQuiz = ({ quizData }) => {
  const [quiz, setQuiz] = useState(null);
  const [originalName, setOriginalName] = useState("");

  useEffect(() => {
    if (quizData) {
      setQuiz({
        ...quizData,
        settings: {
          timer: quizData.timerLength ?? 0,
          incorrectAnswerBehavior: quizData.settings?.incorrectAnswerBehavior ?? "minus",
          openOptionsBehavior: quizData.settings?.openOptionsBehavior ?? "none",
        },
      });
      setOriginalName(quizData.name || "");
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

  const handleSave = async () => {
    const updatedData = {
      name: quiz.name,
      settings: quiz.settings,
    };
    const fileName = `${originalName}.json`;
    const newFileName = quiz.name !== originalName ? `${quiz.name}.json` : null;
  
    try {
      const response = await fetch("http://localhost:5000/api/save-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          newFileName,
          updatedData,
        }),
      });
  
      if (response.ok) {
        alert("Einstellungen erfolgreich gespeichert!");
  
        const newDataResponse = await fetch(`http://localhost:5000/public/erstellteQuize/${quiz.name}.json`);
        const newData = await newDataResponse.json();
        setQuiz(newData);
  
        if (newFileName) setOriginalName(quiz.name);
      } else {
        const error = await response.json();
        console.error("Fehler beim Speichern:", error);
        alert("Fehler beim Speichern der Einstellungen.");
      }
    } catch (error) {
      console.error("Netzwerkfehler:", error);
      alert("Es gab einen Netzwerkfehler.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Bist du sicher, dass du das Quiz "${quiz.name}" löschen möchtest?`
    );
  
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/deleteQuiz/${quiz.name}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        alert("Quiz erfolgreich gelöscht!");
        window.location.reload();
      } else {
        const error = await response.json();
        console.error("Fehler beim Löschen:", error);
        alert("Fehler beim Löschen des Quiz.");
      }
    } catch (error) {
      console.error("Netzwerkfehler:", error);
      alert("Es gab einen Netzwerkfehler.");
    }
  };
  

  return (
    <div>
      <h3>{`Bearbeite Quiz: ${quiz.name}`}</h3>
      <p>Was möchtest du bearbeiten?</p>

    <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="editQuizTabGruppe"
    >
      <Tab 
        className='editQuizTab'
        eventKey="settings" 
        title=" Allgemeine Einstellungen Bearbeiten">
          <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Quiz Namen</Accordion.Header>
          <Accordion.Body>
            <p>Aktueller Name: {quiz.name}</p>
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
            <p>Aktuelle Dauer: {quiz.settings.timer} Sekunden</p>
            <input
              type="number"
              value={quiz.settings.timer || 0}
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
            <p>Aktuelles Verhalten: {quiz.settings.incorrectAnswerBehavior}</p>
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
            <p>Aktuelles Verhalten: {quiz.settings.openOptionsBehavior}</p>
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
      </Tab>
      <Tab 
        className='editQuizTab'
        eventKey="questions" 
        title="Fragen und Antworten Bearbeiten">
      </Tab>

    </Tabs>


      <button className="save-button" onClick={handleSave}>
        Speichern
      </button>
      <button className="delete-button" onClick={handleDelete} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
        Löschen
      </button>
    </div>
  );
};

export default EditQuiz;