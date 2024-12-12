import React from 'react';
import { Table, Button } from 'react-bootstrap';

const Score = ({ spielerReihenfolge, spielerPunkte, currentSpieler, saveResults }) => {
  return (
    <div className="tabelle-container">
      <h3>Spielstand</h3>
      <Table className="spieler-tabelle">
        <thead>
          <tr>
            <th>Spieler</th>
            <th>Punktzahl</th>
          </tr>
        </thead>
        <tbody>
          {spielerReihenfolge.map((spielerName, index) => (
            <tr key={index}>
              <td>{spielerName}</td>
              <td>{spielerPunkte[spielerName]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h4 className="currentSpielerStyle">Aktueller Spieler:
        <br />
        {currentSpieler}
      </h4>
      <Button variant="danger" onClick={saveResults}>
        Quiz beenden
      </Button>
    </div>
  );
};

export default Score;
