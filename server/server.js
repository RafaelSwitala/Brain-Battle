const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

console.log('Server-Setup beginnt...');  // <-- Neuer Log

app.get('/api/spieler', (req, res) => {
  console.log('GET /api/spieler aufgerufen');  // <-- Neuer Log
  const filePath = path.resolve(__dirname, '../public/spieler.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Fehler beim Laden der Spieler:', err);
      return res.status(500).json({ error: 'Fehler beim Laden der Spieler.' });
    }

    try {
      const spieler = JSON.parse(data);
      console.log('Geladene Spieler:', spieler);
      res.json(spieler);
    } catch (parseError) {
      console.error('Fehler beim Parsen der Spieler:', parseError);
      return res.status(500).json({ error: 'Fehler beim Parsen der Spieler.' });
    }
  });
});

app.post('/api/spieler', (req, res) => {
  console.log('POST /api/spieler aufgerufen');  // <-- Neuer Log
  const neuerSpieler = req.body.spielerName;
  const filePath = path.join(__dirname, '../public/spieler.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Fehler beim Lesen der Datei:', err);
      return res.status(500).json({ error: 'Fehler beim Lesen der Datei.' });
    }

    let spielerList = [];
    try {
      spielerList = JSON.parse(data);
    } catch (parseError) {
      console.error('Fehler beim Parsen der Spieler:', parseError);
      return res.status(500).json({ error: 'Fehler beim Parsen der Spieler.' });
    }

    if (!spielerList.includes(neuerSpieler)) {
      spielerList.push(neuerSpieler);

      fs.writeFile(filePath, JSON.stringify(spielerList, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Fehler beim Speichern der Datei:', writeErr);
          return res.status(500).json({ error: 'Fehler beim Speichern der Datei.' });
        }
        console.log('Neuer Spieler hinzugefügt:', neuerSpieler);
        res.status(200).json({ message: 'Spieler erfolgreich hinzugefügt.' });
      });
    } else {
      res.status(400).json({ message: 'Spieler ist bereits in der Liste.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
