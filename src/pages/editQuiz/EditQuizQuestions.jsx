import React from "react";
import Accordion from "react-bootstrap/Accordion";

const EditQuizQuestions = ({ quiz }) => {
  return (
    <Accordion>
      {quiz.categories.map((category, index) => (
        <Accordion.Item eventKey={index.toString()} key={index}>
          <Accordion.Header>{category}</Accordion.Header>
          <Accordion.Body>
            {quiz.questions
              .filter((q) => q.category === category)
              .map((question, questionIndex) => (
                <div key={questionIndex}>{question.text}</div> // Customize the question rendering here
              ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default EditQuizQuestions;
