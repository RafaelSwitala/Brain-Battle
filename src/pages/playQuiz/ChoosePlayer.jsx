import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

const ChoosePlayer = ({ spieler, selectedSpieler, setSelectedSpieler, handleConfirmSpieler }) => {
    return (
      <div>
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
                    onChange={() => {
                      setSelectedSpieler((prevSelected) => {
                        if (Array.isArray(prevSelected)) { 
                          if (prevSelected.includes(spielerItem)) {
                            return prevSelected.filter((name) => name !== spielerItem);
                          } else if (prevSelected.length < 8) {
                            return [...prevSelected, spielerItem];
                          } else {
                            alert("Maximal 8 Spieler können ausgewählt werden.");
                            return prevSelected;
                          }
                        }
                        return [];
                      });
                    }}
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
