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
        Spielerverwaltung Inhalt
      </Tab>
      <Tab 
        className='anleitungTab'
        eventKey="quizErstellen" 
        title="Quiz Erstellen">
        Anleitung zum Erstellen, Bearbeiten und Löschen eines Quizzes
      </Tab>
      <Tab 
        className='anleitungTab'
        eventKey="mobileConnection" 
        title="Verbindung mit Mobilgeräten">
        Auf diese Art und Weise lässt sich ein Handy mit der App verbinden
      </Tab>
    </Tabs>
    </div>
  );
};

export default Anleitungen;
