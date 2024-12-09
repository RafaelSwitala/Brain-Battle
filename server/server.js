const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:9000',
}));

app.use(bodyParser.json());

console.log('Server-Setup beginnt...');

// Route zum Abrufen der Spieler-Daten
app.get('/api/spieler', (req, res) => {
  const filePath = path.resolve(__dirname, '../public/spieler.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Laden der Spieler.' });

    try {
      const spieler = JSON.parse(data);
      res.json(spieler);
    } catch {
      return res.status(500).json({ error: 'Fehler beim Parsen der Spieler.' });
    }
  });
});

// Route zum Aktualisieren der Spieler-Liste
app.post('/api/spieler-liste', (req, res) => {
  const spielerList = req.body;
  const filePath = path.join(__dirname, '../public/spieler.json');

  fs.writeFile(filePath, JSON.stringify(spielerList, null, 2), (writeErr) => {
    if (writeErr) return res.status(500).json({ error: 'Fehler beim Speichern der Datei.' });
    res.status(200).json({ message: 'Spieler-Liste erfolgreich aktualisiert.' });
  });
});

// Route zum Hinzufügen eines neuen Spielers
app.post('/api/spieler', (req, res) => {
  const neuerSpieler = req.body.spielerName;
  const filePath = path.join(__dirname, '../public/spieler.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Lesen der Datei.' });

    let spielerList = [];
    try {
      spielerList = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Fehler beim Parsen der Spieler.' });
    }

    if (!spielerList.includes(neuerSpieler)) {
      spielerList.push(neuerSpieler);

      fs.writeFile(filePath, JSON.stringify(spielerList, null, 2), (writeErr) => {
        if (writeErr) return res.status(500).json({ error: 'Fehler beim Speichern der Datei.' });
        res.status(200).json({ message: 'Spieler erfolgreich hinzugefügt.' });
      });
    } else {
      res.status(400).json({ message: 'Spieler ist bereits in der Liste.' });
    }
  });
});

// Route zum Überprüfen, ob ein Quizname bereits existiert
app.get('/api/check-quiz-name/:name', (req, res) => {
  const quizName = req.params.name;
  const filePath = path.resolve(__dirname, '../public', `${quizName}.json`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    res.json({ exists: !err });
  });
});

// Route zum Speichern eines neuen Quiz als JSON-Datei
app.post('/api/save-json', (req, res) => {
  const { fileName, newFileName, updatedData } = req.body;

  const filePath = path.join(__dirname, '../public/erstellteQuize', fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Quiz-Datei nicht gefunden!' });
  }

  const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const updatedQuizData = {
    ...existingData, 
    name: updatedData.name || existingData.name,
    settings: {
      ...existingData.settings,
      timer: updatedData.timer !== undefined ? updatedData.timer : existingData.settings.timer,
      incorrectAnswerBehavior: updatedData.incorrectAnswerBehavior || existingData.settings.incorrectAnswerBehavior,
      openOptionsBehavior: updatedData.openOptionsBehavior || existingData.settings.openOptionsBehavior
    },
    categories: updatedData.categories || existingData.categories, 
    questions: updatedData.questions || existingData.questions
  };

  const savePath = newFileName ? path.join(__dirname, '../public/erstellteQuize', newFileName) : filePath;
  fs.writeFileSync(savePath, JSON.stringify(updatedQuizData, null, 2));

  res.status(200).json({ message: 'Quiz erfolgreich gespeichert!' });
});



// Route zum Speichern der Quiz-Ergebnisse
app.post('/api/save-results', (req, res) => {
  const { quizName, results } = req.body;
  const dirPath = path.join(__dirname, '../public/ergebnisse');
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  const filePath = path.join(dirPath, `Ergebnis-${quizName}.json`);

  fs.writeFile(filePath, JSON.stringify(results, null, 2), (err) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Speichern der Ergebnisse.' });
    res.status(200).json({ message: 'Ergebnisse erfolgreich gespeichert.' });
  });
});

// Route zum Abrufen der Quiz-Ergebnisse
app.get('/api/ergebnisse', (req, res) => {
  const resultsDir = path.join(__dirname, '../public/ergebnisse');

  fs.readdir(resultsDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Laden der Ergebnisse.' });

    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const results = jsonFiles.map(file => {
      const filePath = path.join(resultsDir, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return { fileName: file, data };
      } catch {
        return { fileName: file, error: 'Fehler beim Parsen.' };
      }
    });

    res.json(results);
  });
});

// Route zum Löschen eines Quiz
app.delete('/api/deleteQuiz/:quizName', (req, res) => {
  const { quizName } = req.params;
  const filePath = path.join(__dirname, '../public/erstellteQuize', `${quizName}.json`);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Löschen des Quiz' });
    res.status(200).json({ message: 'Quiz erfolgreich gelöscht' });
  });
});

// Route zum Löschen eines Quiz-Ergebnisses
app.delete('/api/deleteQuizResult/:quizResultName', (req, res) => {
  const { quizResultName } = req.params;
  const filePath = path.resolve(__dirname, '../public/ergebnisse', `${quizResultName}.json`);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Löschen des Quiz-Ergebnisses' });
    res.status(200).json({ message: 'Quiz-Ergebnisse erfolgreich gelöscht' });
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
