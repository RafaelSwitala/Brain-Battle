const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/save-json', (req, res) => {
  const { fileName, jsonData } = req.body;

  const safeFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;

  const filePath = path.join(__dirname, '../public/erstellteQuize', safeFileName);

  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Fehler beim Speichern der Datei:', err);
      return res.status(500).json({ error: 'Fehler beim Speichern der Datei.' });
    }
    res.status(200).json({ message: `Datei ${safeFileName} erfolgreich gespeichert.` });
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});