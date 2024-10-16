import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './allPages.css';

const SpielerVerwaltung = () => {
  const [spielerName, setSpielerName] = useState('');
  const [spielerList, setSpielerList] = useState([]);
  const [modus, setModus] = useState(1); 
  const [bearbeiteterSpieler, setBearbeiteterSpieler] = useState('');
  const [bearbeitenIndex, setBearbeitenIndex] = useState(null);

  const fetchSpieler = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/spieler');
      setSpielerList(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Spieler:', error);
    }
  };

  const addSpieler = async () => {
    if (spielerName) {
      const neueSpielerList = [...spielerList, spielerName];
      await saveSpieler(neueSpielerList);
      setSpielerName('');
    }
  };

  const saveSpieler = async (spieler) => {
    try {
      await axios.post('http://localhost:5000/api/spieler', spieler);
      setSpielerList(spieler);
    } catch (error) {
      console.error('Fehler beim Speichern der Spieler:', error);
    }
  };

  const updateSpieler = async () => {
    if (bearbeitenIndex !== null) {
      const neueSpielerList = [...spielerList];
      neueSpielerList[bearbeitenIndex] = bearbeiteterSpieler;
      await saveSpieler(neueSpielerList);
      setBearbeiteterSpieler('');
      setBearbeitenIndex(null);
      setModus(1);
    }
  };

  const deleteSpieler = async (index) => {
    if (window.confirm('Möchten Sie diesen Spieler wirklich löschen?')) {
      const neueSpielerList = spielerList.filter((_, i) => i !== index);
      await saveSpieler(neueSpielerList);
    }
  };

  useEffect(() => {
    fetchSpieler();
  }, []);

  return (
    <div>
      <h3>Spielerverwaltung</h3>
      <div className='mainPage-container'>
        {modus === 1 && (
          <div>
            <input
              type="text"
              value={spielerName}
              onChange={(e) => setSpielerName(e.target.value)}
              placeholder="Spielernamen eingeben"
            />
            <button onClick={addSpieler}>Spieler hinzufügen</button>
            <h4>Spielerliste</h4>
            <ul>
              {spielerList.map((spieler, index) => (
                <li key={index}>
                  {spieler}
                  <button onClick={() => { setBearbeitenIndex(index); setBearbeiteterSpieler(spieler); setModus(2); }}>Bearbeiten</button>
                  <button onClick={() => deleteSpieler(index)}>Löschen</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {modus === 2 && (
          <div>
            <h4>Spieler bearbeiten</h4>
            <input
              type="text"
              value={bearbeiteterSpieler}
              onChange={(e) => setBearbeiteterSpieler(e.target.value)}
              placeholder="Neuer Spielername"
            />
            <button onClick={updateSpieler}>Aktualisieren</button>
            <button onClick={() => setModus(1)}>Zurück</button>
          </div>
        )}
        {modus === 3 && (
          <div>
            <h4>Löschen</h4>
            <ul>
              {spielerList.map((spieler, index) => (
                <li key={index}>
                  {spieler}
                  <button onClick={() => deleteSpieler(index)}>X</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setModus(1)}>Zurück</button>
          </div>
        )}
      </div>
      <div>
        <button onClick={() => setModus(1)}>Modus 1</button>
        <button onClick={() => setModus(2)}>Modus 2</button>
        <button onClick={() => setModus(3)}>Modus 3</button>
      </div>
    </div>
  );
};

export default SpielerVerwaltung;
