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

app.use(cors());
app.use(bodyParser.json());

console.log('Server-Setup beginnt...');

// Route zum Abrufen der Spieler-Daten
app.get('/api/spieler', (req, res) => {
  console.log('GET /api/spieler aufgerufen');
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

// Route zum Aktualisieren der Spieler
app.post('/api/spieler', (req, res) => {
  console.log('POST /api/spieler aufgerufen');
  const spielerList = req.body;
  const filePath = path.join(__dirname, '../public/spieler.json');

  fs.writeFile(filePath, JSON.stringify(spielerList, null, 2), (writeErr) => {
    if (writeErr) {
      console.error('Fehler beim Speichern der Datei:', writeErr);
      return res.status(500).json({ error: 'Fehler beim Speichern der Datei.' });
    }
    console.log('Spieler-Liste erfolgreich aktualisiert');
    res.status(200).json({ message: 'Spieler-Liste erfolgreich aktualisiert.' });
  });
});

// Route zum Hinzufügen eines neuen Spielers
app.post('/api/spieler', (req, res) => {
  console.log('POST /api/spieler aufgerufen');
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

// Route zum Überprüfen, ob ein Quizname bereits existiert
app.get('/api/check-quiz-name/:name', (req, res) => {
  const quizName = req.params.name;
  const filePath = path.resolve(__dirname, '../public', `${quizName}.json`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.json({ exists: false });
    } else {
      res.json({ exists: true });
    }
  });
});

// Route zum Speichern eines neuen Quiz als JSON-Datei
app.post('/api/save-json', (req, res) => {
  const { fileName, jsonData } = req.body;
  const filePath = path.join(__dirname, '../public/erstellteQuize', fileName);

  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Fehler beim Speichern der Datei:', err);
      return res.status(500).json({ error: 'Fehler beim Speichern der Datei.' });
    }
    console.log('Datei erfolgreich gespeichert:', fileName);
    res.status(200).json({ message: 'Datei erfolgreich gespeichert.' });
  });
});

// Route zum Speichern der Quiz-Ergebnisse
app.post('/api/save-results', (req, res) => {
  const { quizName, results } = req.body;
  const filePath = path.join(__dirname, '../public/ergebnisse', `Ergebnis-${quizName}.json`);

  fs.writeFile(filePath, JSON.stringify(results, null, 2), (err) => {
    if (err) {
      console.error('Fehler beim Speichern der Ergebnisse:', err);
      return res.status(500).json({ error: 'Fehler beim Speichern der Ergebnisse.' });
    }
    console.log('Ergebnisse erfolgreich gespeichert:', `Ergebnis-${quizName}.json`);
    res.status(200).json({ message: 'Ergebnisse erfolgreich gespeichert.' });
  });
});

// Route zum Abrufen der Quiz-Ergebnisse
app.get('/api/ergebnisse', (req, res) => {
  console.log('GET /api/ergebnisse aufgerufen');
  const resultsDir = path.join(__dirname, '../public/ergebnisse');

  fs.readdir(resultsDir, (err, files) => {
    if (err) {
      console.error('Fehler beim Lesen des Verzeichnisses:', err);
      return res.status(500).json({ error: 'Fehler beim Laden der Ergebnisse.' });
    }

    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const results = jsonFiles.map(file => {
      const filePath = path.join(resultsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return { fileName: file, data };
    });

    res.json(results);
  });
});

// Route zum Löschen eines Quiz
app.delete('/api/deleteQuiz/:quizName', (req, res) => {
  const { quizName } = req.params;
  const filePath = path.join(__dirname, '../public/erstellteQuize', `${quizName}.json`);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Fehler beim Löschen der Datei:', err);
      return res.status(500).json({ error: 'Fehler beim Löschen des Quiz' });
    }
    res.status(200).json({ message: 'Quiz erfolgreich gelöscht' });
  });
});

// Route zum Löschen eines Quiz-Ergebnisses
app.delete('/api/deleteQuizResult/:quizResultName', (req, res) => {
  const { quizResultName } = req.params;
  const filePath = path.resolve(__dirname, '../public/ergebnisse', `${quizResultName}.json`);

  console.log("Dateipfad zum Löschen:", filePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Die Datei existiert nicht oder ist nicht zugreifbar:", err);
      return res.status(404).json({ error: "Datei nicht gefunden" });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Fehler beim Löschen der Datei:", err);
        return res.status(500).json({ error: "Fehler beim Löschen des Quiz-Ergebnisses" });
      }
      res.status(200).json({ message: "Quiz-Ergebnisse erfolgreich gelöscht" });
    });
  });
});







// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
