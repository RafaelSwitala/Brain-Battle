import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './allPages.css';

const SpielerVerwaltung = () => {
  const [spielerName, setSpielerName] = useState('');
  const [spielerList, setSpielerList] = useState([]);
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
      try {
        const response = await axios.post('http://localhost:5000/api/spieler', { spielerName });
        if (response.status === 200) {
          fetchSpieler();
          setSpielerName('');
        }
      } catch (error) {
        console.error('Fehler beim Hinzufügen des Spielers:', error);
      }
    } else {
      alert('Bitte geben Sie einen Spielernamen ein.');
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
              <span>{spieler}</span>
              <div className="button-container">
                <button onClick={() => { setBearbeitenIndex(index); setBearbeiteterSpieler(spieler); updateSpieler(); }}>Bearbeiten</button>
                <button onClick={() => deleteSpieler(index)}>Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpielerVerwaltung;
