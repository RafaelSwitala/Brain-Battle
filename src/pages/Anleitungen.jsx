import React, { useEffect, useState } from 'react';
import './allPages.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Anleitungen = () => {
  return (
    <div>
      <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="anleitungTabGruppe"
    >
      <Tab 
        className='anleitungTab'
        eventKey="spielerVerwaltung" 
        title="Spielerverwaltung">
          <h4>Spielerverwaltung</h4>
          <br />
          <h5>1. Neue Spieler Erstellen</h5>
          <p className='pInhalt'>Navigiere zur Spielerverwaltung.</p>
          <p className='pInhalt'>Vergebe einen Namen und drücke auf den Button: Spieler Hinzufügen</p>
          <p className='pInhalt'>Du wirst jetzt die Verbindung zur Anwendung verlieren. Der Spieler wurde aber erfolgreich erstellt!</p>
          <p className='pInhalt'>Gehe wieder zurück auf die HomePage und aktualisiere die Seite. Der eben erstellte Spieler wird dir in der Spieleransicht angezeigt.</p>
          <br /> <br />
          <h5>2. Vorhandene Spieler Bearbeiten</h5>
          <p className='pInhalt'>Navigiere zur Spielerverwaltung</p>
          <p className='pInhalt'>Durch das klicken auf den Bearbeiten-Button öffnet sich ein neues Eingabefeld in dem du die Möglichkeit hast, den vorhandenen Spieler zu umschreiben.</p>
          <p className='pInhalt'>Klickst du auf Abbrechen, so schließt das Fenster wieder ohne einer Änderung. Klickst du auf Aktualisieren, änderst du den Namen des Spielers.</p>
          <p className='pInhalt'>Du wirst jetzt die Verbindung zur Anwendung verlieren. Der Spieler wurde aber erfolgreich aktualisiert!</p>
          <p className='pInhalt'>Gehe wieder zurück auf die HomePage und aktualisiere die Seite. Der eben bearbeitete Spieler wird dir in der Spieleransicht angezeigt.</p>
          <br /> <br />
          <h5>3. Vorhandene Spieler Löschen</h5>
          <p className='pInhalt'>Navigiere zur Spielerverwaltung</p>
          <p className='pInhalt'>Durch das klicken auf den Löschen-Button öffnet sich ein Fenster in dem du die Möglichkeit hast, einen vorhandenen Spieler zu löschen.</p>
          <p className='pInhalt'>Klickst du auf Abbrechen, so schließt das Fenster wieder ohne einer Änderung. Klickst du auf Ok, dann wird der Spieler entfernt.</p>
          <p className='pInhalt'>Du wirst jetzt die Verbindung zur Anwendung verlieren. Der Spieler wurde aber erfolgreich entfernt!</p>
          <p className='pInhalt'>Gehe wieder zurück auf die HomePage und aktualisiere die Seite. Der eben gelöschte Spieler wird dir nicht mehr in der Spieleransicht angezeigt.</p>
          
      </Tab>
      <Tab 
        className='anleitungTab'
        eventKey="quizManipulation" 
        title="Quiz Erstellen">
          <h4>Quiz Manipulationen</h4>
          <br />
          <h5>1. Neues Quiz Erstellen</h5>
          <p className='pInhalt'>Im Dashboard der Homepage befindet sich ein Button zum erstellen eines Quizes.</p>
          <p className='pInhalt'>Gebe den Namen des Quizes ein. Achte darauf, dass sich im Quiznamen keine Sonderzeichen, keine Punkte und keine Leerzeichen befinden dürfen. Ein Quiznamen muss mindestens 3 Zeichen enthalten.</p>
          <p className='pInhalt'>Wähle die Anzahl der Kategorien, die Anzahl der Schwierigkeitslevel und die Punkteschritte aus und klicke dann auf Fragenfelder generieren.</p>
          <p className='pInhalt'>Gan oben werden dir leere Eingabefelder angezeigt. Ein Eingabefeld entspricht einer Kategorie. Jedes dieser Felder muss ausgefüllt werden.</p>
          <p className='pInhalt'>Darunter befinden sich die generierten Frage und Antwort Eingabefelder. Gebe zu jeder Kategorie und zu jedem Schwierigkeitslevel eine Frage ein.</p>
          <p className='pInhalt'>Du kannst optional die richtige Antwort in das Feld darunter eintragen und Antwortoptionen hinzufügen.</p>
          <p className='pInhalt'>Hast du alles eingetragen kannst du weiter zu Seite 3 gehen. Hier werden 3 Spieleinstellungen definiert:</p>
          <p className='pInhalt'>- Timer: Du kannst dir aussuchen, wie lange ein Spieler Zeit hat zum Beantworten einer Frage.</p>
          <p className='pInhalt'>- Verhalten bei falscher Antwort: Entscheide dich, ob der Spieler die Frage ohne Punkte beendet, ob es Minuspunkte bekommt oder ob die Frage noch einmal beantwortet werden darf.</p>
          <p className='pInhalt'>- Verhalten beim öffnen der Antwortmöglichkeiten: Entscheide dich, ob der Spieler immernoch die volle Punktzahl oder nur noch die halbe Punktzahl für das richtige Beantworten der Frage bekommt, nachdem er sich dazu entscheiden hat, die Antwortsmöglichkeiten einzublenden.</p>
          <p className='pInhalt'>Durch den Klick auf Quiz erstellen, wird dir das Quiz in der Quiz Übersicht angezeigt.</p>
          <br /> <br />
          <h5>2. Vorhandenes Quiz Bearbeiten</h5>
          <p className='pInhalt'>Das Bearbeiten eines Quizes ist leider nur über einen Umwege möglich:</p>
          <p className='pInhalt'>Du erstellst ein neues Quiz und vergibst den selben Namen des Quizes nocheinmal. Anschließend musst du nochmal von vorne alle Fragen, Antworten, Antwortoptionen und Einstellungen eingeben.</p>
          <p className='pInhalt'>Beim Klicken auf Quiz Erstellen am Ende, wird das alte Quiz durch das neue Quiz überschrieben.</p>
          <p className='pInhalt'>Deswegen gibt es eine Alternative:</p>
          <p className='pInhalt'>Du befindest dich in Visual Studio Code!</p>
          <p className='pInhalt'>Navigiere zum Ordner public, dann erstellteQuize und öffne die .json-Datei mit dem entsprechenden Namen.</p>
          <p className='pInhalt'>Solltest du eine bestimmte Frage anpassen wollen, gehe zu der Frage hin und bearbeite sie. Solltest du den Timer anpassen wollen, ändere die Zeit.</p>
          <p className='pInhalt'>Wenn du mit der Bearbeitung fertig bist, kannst du die .json-Datei speichern und schließen. In der Anwendung werden die Daten sofort aktualisiert!</p>
         <br /> <br />
          <h5>3. Vorhandenes Quiz Löschen</h5>
          <p className='pInhalt'>In der Quiz Übersicht auf deiner Homepage befindet sich eine Tabelle.</p>
          <p className='pInhalt'>In der letzten Spalte befindet sich ein Mülleimer Icon. Klicke darauf und bestätige deine Entscheidung</p>
          <p className='pInhalt'>Achtung: Auf diese Weise löscht du das Quiz entgültig!</p>
      </Tab>
      <Tab 
        className='anleitungTab'
        eventKey="versionsUpdate" 
        title="Versions Update">
          <h4>Versions Update</h4>
          <h5>Befolge diese Schritte um eine neue Version der Anwendung herunter zu laden:</h5>
          <p className='pInhalt'>Sollte es eine neue Version von der Anwendung geben, mit neuen Funktionen oder Fehlerbehebungen etc. dann gehe wie folgt vor:</p>
          <p className='pInhalt'>Navigiere zum public Ordner und öffne die spieler.json Datei. Kopiere dir den kompletten Inhalt dieser Datei und füge ihn hier ein: public, dann backup, dann spieler.json</p>
          <p className='pInhalt'>Navigiere zum public Ordner, dann erstellteQuize. Kopiere alle Quizdateien und füge sie hier ein: public, dann backup, dann erstellteQuize</p>
          <p className='pInhalt'>Kopiere die den kompletten Backup-Ordner an einen Ort wo du es wieder finden kannst. Z.b. Desktop</p>
          <p className='pInhalt'>Gehe zurück zu Visual Studio Code und öffne ein Terminal: STRG + Ö</p>
          <p className='pInhalt'>Gebe folgenden Befehl ein: git pull --all</p>
          <p className='pInhalt'>Nach einer kurzen Installation, gebe diesen Befehl ein: npm install</p>
          <p className='pInhalt'>Kopiere den Inhalt deines Backup Ordners in den Ordner public. Du wirst gefragt ob du die Dateien Überschreiben möchtest. Antworte mit JA!</p>
          <p className='pInhalt'>Du kannst jetzt deine Anwendung wie gewohnt starten. Viel Spaß mit der neuen Version!</p>
          <p className='pInhalt'></p>
      </Tab>
    </Tabs>
    </div>
  );
};

export default Anleitungen;
