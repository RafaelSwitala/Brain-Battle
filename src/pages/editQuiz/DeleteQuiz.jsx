import React from "react";

const DeleteQuiz = ({ quizName }) => {
  const handleDelete = async () => {
    if (!window.confirm(`Bist du sicher, dass du das Quiz \"${quizName}\" löschen möchtest?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/deleteQuiz/${quizName}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Quiz erfolgreich gelöscht!");
        window.location.reload();
      } else {
        alert("Fehler beim Löschen des Quiz.");
      }
    } catch (error) {
      alert("Es gab einen Netzwerkfehler.");
    }
  };

  return (
    <button
      className="delete-button"
      onClick={handleDelete}
      style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
    >
      Löschen
    </button>
  );
};

export default DeleteQuiz;
