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
          
          <h5>1. Einen neuen Spieler erstellen</h5>
          <p className='pInhalt'>Öffne die Spielerverwaltung und gib einen Namen für den neuen Spieler ein.</p>
          <p className='pInhalt'>Klicke auf „Spieler hinzufügen“. Dadurch verlierst du kurz die Verbindung zur Anwendung, aber der Spieler wurde erfolgreich erstellt!</p>
          <p className='pInhalt'>Gehe zurück zur Homepage und aktualisiere die Seite. Der neu erstellte Spieler wird nun in der Übersicht angezeigt.</p>
          <br /><br />
          
          <h5>2. Vorhandene Spieler bearbeiten</h5>
          <p className='pInhalt'>Gehe in die Spielerverwaltung.</p>
          <p className='pInhalt'>Klicke auf den Bearbeiten-Button des gewünschten Spielers. Ein Eingabefeld wird geöffnet, in dem du den Namen ändern kannst.</p>
          <p className='pInhalt'>Falls du den Vorgang abbrechen möchtest, klicke auf „Abbrechen“. Mit „Aktualisieren“ wird der Spielername geändert.</p>
          <p className='pInhalt'>Nach der Aktualisierung verlierst du kurz die Verbindung zur Anwendung. Gehe dann zurück zur Homepage und aktualisiere die Seite, um die Änderungen zu sehen.</p>
          <br /><br />
          
          <h5>3. Vorhandene Spieler löschen</h5>
          <p className='pInhalt'>Öffne die Spielerverwaltung.</p>
          <p className='pInhalt'>Klicke auf den Löschen-Button des gewünschten Spielers. Ein Fenster erscheint zur Bestätigung des Löschvorgangs.</p>
          <p className='pInhalt'>Falls du den Vorgang abbrechen möchtest, klicke auf „Abbrechen“. Mit „OK“ wird der Spieler entfernt.</p>
          <p className='pInhalt'>Nach dem Löschen verlierst du kurz die Verbindung zur Anwendung. Gehe dann zurück zur Homepage und aktualisiere die Seite. Der gelöschte Spieler wird nicht mehr angezeigt.</p>
      </Tab>

      <Tab 
        className='anleitungTab'
        eventKey="quizManipulation" 
        title="Quiz Erstellen">
          <h4>Quiz Verwaltung</h4>
          <br />
          
          <h5>1. Ein neues Quiz erstellen</h5>
          <p className='pInhalt'>Klicke im Dashboard auf „Quiz erstellen“.</p>
          <p className='pInhalt'>Gib einen Namen ein – ohne Sonderzeichen, Punkte oder Leerzeichen. Der Name muss mindestens drei Zeichen enthalten.</p>
          <p className='pInhalt'>Wähle Anzahl der Kategorien, Schwierigkeitsstufen und Punkteschritte aus, dann klicke auf „Fragenfelder generieren“.</p>
          <p className='pInhalt'>Oben erscheinen leere Eingabefelder, je eines pro Kategorie. Fülle jedes dieser Felder aus.</p>
          <p className='pInhalt'>Darunter findest du die generierten Frage- und Antwortfelder. Gib pro Kategorie und Schwierigkeitsgrad eine Frage ein.</p>
          <p className='pInhalt'>Optional kannst du die richtige Antwort und Antwortoptionen hinzufügen.</p>
          <p className='pInhalt'>Klicke auf „Weiter zu Seite 3“ und definiere die Spieleinstellungen:</p>
          <p className='pInhalt'>- Timer: Lege fest, wie lange ein Spieler Zeit hat, eine Frage zu beantworten.</p>
          <p className='pInhalt'>- Verhalten bei falscher Antwort: Bestimme, ob der Spieler Punkte verliert, eine zweite Chance bekommt oder die Frage ohne Punkte beendet wird.</p>
          <p className='pInhalt'>- Verhalten bei eingeblendeten Antwortoptionen: Entscheide, ob für eine richtige Antwort noch die volle oder nur die halbe Punktzahl vergeben wird.</p>
          <p className='pInhalt'>Durch „Quiz erstellen“ wird das Quiz in der Übersicht angezeigt.</p>
          <br /><br />
          
          <h5>2. Ein vorhandenes Quiz bearbeiten</h5>
          <p className='pInhalt'>Eine direkte Bearbeitung ist nicht möglich. Du kannst jedoch ein neues Quiz mit dem gleichen Namen erstellen und die Inhalte erneut eingeben.</p>
          <p className='pInhalt'>Alternativ kannst du das Quiz in Visual Studio Code bearbeiten:</p>
          <p className='pInhalt'>Öffne im Ordner „public/erstellteQuize“ die passende .json-Datei und ändere die gewünschten Inhalte (z.B. Timer oder Fragen).</p>
          <p className='pInhalt'>Speichere die Datei – die Änderungen werden sofort in der Anwendung sichtbar.</p>
          <br /><br />
          
          <h5>3. Ein vorhandenes Quiz löschen</h5>
          <p className='pInhalt'>In der Quiz-Übersicht findest du in der letzten Spalte der Tabelle ein Mülleimer-Icon.</p>
          <p className='pInhalt'>Klicke darauf und bestätige den Löschvorgang. Achtung: Diese Aktion entfernt das Quiz dauerhaft!</p>
      </Tab>

      <Tab 
        className='anleitungTab'
        eventKey="versionsUpdate" 
        title="Versions-Update">
          <h4>Versions-Update</h4>
          <h5>Schritte zur Installation einer neuen Version:</h5>
          <p className='pInhalt'>Falls eine neue Version verfügbar ist, folge diesen Schritten:</p>
          <p className='pInhalt'>Gehe in den Ordner „public“ und öffne die Datei „spieler.json“. Kopiere den Inhalt und füge ihn im Ordner „backup/spieler.json“ ein.</p>
          <p className='pInhalt'>Kopiere die Dateien im Ordner „erstellteQuize“ und füge sie im Ordner „backup/erstellteQuize“ ein.</p>
          <p className='pInhalt'>Speichere den „backup“-Ordner an einem Ort, den du leicht findest (z.B. Desktop).</p>
          <p className='pInhalt'>Öffne in Visual Studio Code das Terminal mit „STRG + Ö“ und gib „git pull --all“ ein.</p>
          <p className='pInhalt'>Nach dem Download führe „npm install“ aus, um alle Abhängigkeiten zu aktualisieren.</p>
          <p className='pInhalt'>Gebe im Terminal folgenden Befehl ein: git checkout release/versionsNummer</p>
          <p className='pInhalt'>Kopiere den Inhalt des „backup“-Ordners zurück in den „public“-Ordner und bestätige das Überschreiben der Dateien.</p>
          <p className='pInhalt'>Nun kannst du die Anwendung wie gewohnt starten und die neue Version verwenden!</p>
      </Tab>

    </Tabs>
    </div>
  );
};

export default Anleitungen;
