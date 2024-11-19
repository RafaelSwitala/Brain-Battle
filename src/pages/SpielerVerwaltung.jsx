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
    if (!spielerName) {
      alert('Bitte geben Sie einen Spielernamen ein.');
      return;
    }
    if (spielerName.length > 18) {
      alert('Der Spielername darf maximal 18 Zeichen enthalten.');
      return;
    }
    if (spielerList.includes(spielerName)) {
      alert('Spieler ist bereits in der Liste.');
      return;
    }

    const neueSpielerList = [...spielerList, spielerName];
    try {
      await axios.post('http://localhost:5000/api/spieler', neueSpielerList);
      setSpielerList(neueSpielerList);
      setSpielerName('');
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Spielers:', error);
    }
  };

  const updateSpieler = async () => {
    if (bearbeitenIndex === null) return;

    if (!bearbeiteterSpieler) {
      alert('Bitte geben Sie einen Spielernamen ein.');
      return;
    }
    if (bearbeiteterSpieler.length > 18) {
      alert('Der Spielername darf maximal 18 Zeichen enthalten.');
      return;
    }

    const neueSpielerList = [...spielerList];
    neueSpielerList[bearbeitenIndex] = bearbeiteterSpieler;

    try {
      await axios.post('http://localhost:5000/api/spieler', neueSpielerList);
      setSpielerList(neueSpielerList);
      setBearbeiteterSpieler('');
      setBearbeitenIndex(null);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Spieler:', error);
    }
  };

  const deleteSpieler = async (index) => {
    if (window.confirm('Möchten Sie diesen Spieler wirklich löschen?')) {
      const neueSpielerList = spielerList.filter((_, i) => i !== index);

      try {
        await axios.post('http://localhost:5000/api/spieler', neueSpielerList);
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
          placeholder="Spielernamen eingeben (max. 18 Zeichen)"
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
              placeholder="Neuer Spielername (max. 18 Zeichen)"
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
