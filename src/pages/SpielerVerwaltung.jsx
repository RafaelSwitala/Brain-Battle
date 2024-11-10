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
      if (!spielerList.includes(spielerName)) {
        try {
          await axios.post('http://localhost:5000/api/addSpieler', { spielerName });
          setSpielerList(prevList => [...prevList, spielerName]);
          setSpielerName('');
        } catch (error) {
          console.error('Fehler beim Hinzufügen des Spielers:', error);
        }
      } else {
        alert('Spieler ist bereits in der Liste.');
      }
    } else {
      alert('Bitte geben Sie einen Spielernamen ein.');
    }
  };

  const updateSpieler = async () => {
    if (bearbeitenIndex !== null) {
      const alteSpielerName = spielerList[bearbeitenIndex];
      const neueSpielerName = bearbeiteterSpieler;

      if (alteSpielerName !== neueSpielerName) {
        try {
          await axios.post('http://localhost:5000/api/updateSpieler', { alteSpielerName, neueSpielerName });
          const neueSpielerList = [...spielerList];
          neueSpielerList[bearbeitenIndex] = neueSpielerName;
          setSpielerList(neueSpielerList);
          setBearbeiteterSpieler('');
          setBearbeitenIndex(null);
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Spielers:', error);
        }
      } else {
        alert('Der Name ist bereits derselbe!');
      }
    }
  };

  const deleteSpieler = async (index) => {
    const spielerNameToDelete = spielerList[index];
    if (window.confirm(`Möchten Sie ${spielerNameToDelete} wirklich löschen?`)) {
      try {
        await axios.post('http://localhost:5000/api/deleteSpieler', { spielerName: spielerNameToDelete });
        const neueSpielerList = spielerList.filter((_, i) => i !== index);
        setSpielerList(neueSpielerList);
      } catch (error) {
        console.error('Fehler beim Löschen des Spielers:', error);
      }
    }
  };

  useEffect(() => {
    fetchSpieler();
  }, []);

  return (
    <div className='spielerVerwaltungContainer'>
      <h3>Spielerverwaltung</h3>
      <div className='mainPage-container mainPage-container-spielerVerwaltung'>
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
                <button onClick={() => { setBearbeitenIndex(index); setBearbeiteterSpieler(spieler); }}>Bearbeiten</button>
                <button onClick={() => deleteSpieler(index)}>Löschen</button>
              </div>
            </li>
          ))}
        </ul>
        {bearbeitenIndex !== null && (
          <div>
            <h4>Spieler bearbeiten</h4>
            <input
              type="text"
              value={bearbeiteterSpieler}
              onChange={(e) => setBearbeiteterSpieler(e.target.value)}
              placeholder="Neuer Spielername"
            />
            <button onClick={updateSpieler}>Aktualisieren</button>
            <button onClick={() => setBearbeitenIndex(null)}>Abbrechen</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpielerVerwaltung;
