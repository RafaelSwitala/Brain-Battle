import React, { useEffect, useState } from 'react';
import './allPages.css';
import Accordion from 'react-bootstrap/Accordion';

const Ergebnisse = () => {
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ergebnisse');
        if (!response.ok) throw new Error(`Fehler: ${response.statusText}`);
        
        const results = await response.json(); 

        setQuizResults(results);
      } catch (error) {
        console.error('Fehler beim Laden der Ergebnisse:', error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h3>Ergebnisse</h3>
      <div className='mainPage-container'>
        <Accordion defaultActiveKey="0">
          {quizResults.map((result, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>{result.fileName.replace('.json', '')}</Accordion.Header>
              <Accordion.Body>
                <p><strong>Datum:</strong> {result.data.date}</p>
                <p><strong>Uhrzeit:</strong> {result.data.time}</p>
                <h4>Punkte:</h4>
                <ul>
                  {Object.entries(result.data.scores).map(([name, score]) => (
                    <li key={name}>
                      {name}: {score} Punkte
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Ergebnisse;
