import React from 'react';
import Button from 'react-bootstrap/Button';

const ChoosePlayer = ({ spieler, selectedSpieler, handleCheckboxChange, handleConfirmSpieler }) => {
  return (
    <div className='quizSpielenSpieler'>
      <h3>Spieler auswählen</h3>
      <div className='wer-spielt-mit'>
        <div className="spieler-auswahl">
          <h4>Spieler auswählen:</h4>
          {spieler.length > 0 ? (
            spieler.map((spielerItem, index) => (
              <div key={index}>
                <input
                  className='spielerAuswahlCheckbox'
                  type="checkbox"
                  id={`spieler-${index}`}
                  checked={selectedSpieler.includes(spielerItem)}
                  onChange={() => handleCheckboxChange(spielerItem)}
                />
                <label className='spielerNameLabel' htmlFor={`spieler-${index}`}>{spielerItem}</label>
              </div>
            ))
          ) : (
            <div>Keine Spieler verfügbar</div>
          )}
        </div>

        <div className="ausgewählte-spieler">
          <h4>Ausgewählte Spieler:</h4>
          <ul>
            {selectedSpieler.map((spielerName, index) => (
              <li className='spielerNameGewaehlt' key={index}>{spielerName}</li>
            ))}
          </ul>
        </div>
      </div>
      <Button className='quizStartenButton' variant="primary" onClick={handleConfirmSpieler}>
        Quiz beginnen
      </Button>
    </div>
  );
};

export default ChoosePlayer;
