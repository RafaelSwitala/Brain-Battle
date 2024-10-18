const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/erstellteQuize', (req, res) => {
  const quizDir = path.join(__dirname, 'erstellteQuize');
  fs.readdir(quizDir, (err, files) => {
    if (err) {
      console.error('Fehler beim Lesen des Verzeichnisses:', err);
      return res.status(500).send('Fehler beim Lesen des Verzeichnisses');
    }
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    const fileLinks = jsonFiles.map(file => `/erstellteQuize/${file}`);
    res.send(fileLinks);
  });
});

app.delete('/api/delete-quiz/:quizName', (req, res) => {
  const quizName = req.params.quizName;
  const filePath = path.join(__dirname, 'erstellteQuize', `${quizName}.json`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Quiz nicht gefunden:', err);
      return res.status(404).send('Quiz nicht gefunden');
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Fehler beim Löschen der Datei:', err);
        return res.status(500).send('Fehler beim Löschen der Datei');
      }
      res.send(`Quiz "${quizName}" wurde gelöscht`);
    });
  });
});

app.post('/api/save-json', (req, res) => {
  const { fileName, jsonData } = req.body;
  const filePath = path.join(__dirname, 'erstellteQuize', fileName);

  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Fehler beim Speichern der Datei:', err);
      return res.status(500).send('Fehler beim Speichern der Datei');
    }
    res.send('Quiz wurde erfolgreich gespeichert');
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
