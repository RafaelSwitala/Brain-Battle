const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/spieler', (req, res) => {
  const filePath = path.join(__dirname, '../public/spieler.json');

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
  const spielerList = req.body;

  const filePath = path.join(__dirname, '../public/spieler.json');

  fs.writeFile(filePath, JSON.stringify(spielerList, null, 2), (err) => {
    if (err) {
      console.error('Fehler beim Speichern der Datei:', err);
      return res.status(500).json({ error: 'Fehler beim Speichern der Datei.' });
    }
    res.status(200).json({ message: 'Spieler erfolgreich gespeichert.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});