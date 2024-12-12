import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const shuffleOptions = (options) => {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
};

const QuestionModal = ({ selectedQuestion, timer, isTimerRunning, handleTimerStart, isContentVisible, toggleContentVisibility, handleAnswerClick }) => {
  return (
    <Modal className='quizModal' show={true} onHide={() => { toggleContentVisibility(); }}>
      <Modal.Header className='modalHeader' closeButton>
        <Modal.Title className='modalQuestion'>
          <small>{selectedQuestion.category} - {selectedQuestion.points} Punkte</small>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBody'>
        <div className="questionText">{selectedQuestion.question}</div>

        {!isTimerRunning && (
          <Button className='timerButton' onClick={handleTimerStart}>
            Start Timer
          </Button>
        )}
        <h5>Zeit verbleibend: {timer} Sekunden</h5>

        <Button
          className='beantwortenButton richtigButton'
          onClick={() => handleAnswerClick(true)}
        >
          Richtig
        </Button>

        <Button
          className='beantwortenButton falschButton'
          onClick={() => handleAnswerClick(false)}
        >
          Falsch
        </Button>

        <Button onClick={toggleContentVisibility} variant="primary" className='antwortoptionenAnzeigenButton'>
          {isContentVisible ? "Schließen" : "Antwortmöglichkeiten anzeigen"}
        </Button>

        {isContentVisible && (
          <div className="mt-3">
            {shuffleOptions([selectedQuestion.answer, ...selectedQuestion.options]).map(
              (option, index) => (
                <Button
                  key={index}
                  variant="outline-primary"
                  className="d-block mb-2 antwortOptionen"
                  onClick={() => handleAnswerClick(option === selectedQuestion.answer)}
                >
                  {option}
                </Button>
              )
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className='modalFooter'></Modal.Footer>
    </Modal>
  );
};

export default QuestionModal;
