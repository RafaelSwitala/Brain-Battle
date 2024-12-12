import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import EditQuizSettings from "./EditQuizSettings";
import EditQuizQuestions from "./EditQuizQuestions";
import DeleteQuiz from "./DeleteQuiz";
import "../allPages.css";

const EditQuiz = ({ quizData }) => {
  const [quiz, setQuiz] = useState(null);
  const [originalName, setOriginalName] = useState("");

  useEffect(() => {
    if (!quizData) return;

    const categories = quizData.categories || [];
    const questions = quizData.questions || [];

    setQuiz({
      ...quizData,
      settings: {
        timer: quizData.timerLength || 0,
        incorrectAnswerBehavior: quizData.wrongAnswerBehavior || "minus",
        openOptionsBehavior: quizData.openAnswerBehavior || "none",
      },
      categories,
      questions,
    });

    setOriginalName(quizData.name || "");
  }, [quizData]);

  if (!quiz || !quiz.settings) return <div>Lade Daten...</div>;

  const handleChange = (field, value) => {
    setQuiz((prev) => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field, value) => {
    setQuiz((prev) => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
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
        const newDataResponse = await fetch(
          `http://localhost:5000/public/erstellteQuize/${quiz.name}.json`
        );
        const newData = await newDataResponse.json();
        setQuiz(newData);
        if (newFileName) setOriginalName(quiz.name);
      } else {
        alert("Fehler beim Speichern der Einstellungen.");
      }
    } catch (error) {
      alert("Es gab einen Netzwerkfehler.");
    }
  };

  return (
    <div>
      <h3>{`Bearbeite Quiz: ${quiz.name}`}</h3>
      <p>Was möchtest du bearbeiten?</p>

      <Tabs defaultActiveKey="settings" id="edit-quiz-tabs" className="editQuizTabGruppe">
        <Tab eventKey="settings" title="Allgemeine Einstellungen">
          <EditQuizSettings
            quiz={quiz}
            handleChange={handleChange}
            handleSettingsChange={handleSettingsChange}
          />
        </Tab>

        <Tab eventKey="questions" title="Fragen und Antworten">
          <EditQuizQuestions quiz={quiz} />
        </Tab>
      </Tabs>

      <button className="save-button" onClick={handleSave}>Speichern</button>
      <DeleteQuiz quizName={quiz.name} />
    </div>
  );
};

export default EditQuiz;
