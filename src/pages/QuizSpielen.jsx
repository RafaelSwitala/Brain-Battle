import React, { useState } from 'react';
import './allPages.css';

const QuizSpielen = () => {
  const [columns, setColumns] = useState(2);
  const [rows, setRows] = useState(4);

  const generateCells = () => {
    const cells = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const cellId = String(i * columns + j + 1).padStart(2, '0'); // ID mit führender Null
        cells.push(<div key={cellId} className="grid-cell">{cellId}</div>);
      }
    }
    return cells;
  };
  const generateCategoryHeaders = () => {
    const headers = [];
    for (let i = 0; i < columns; i++) {
      headers.push(<div key={`header-${i}`} className="grid-cell">Kategorie {i + 1}</div>);
    }
    return headers;
  };

  return (
    <div>
      <h3>Quiz Spielen</h3>
      <div className='mainPage-container'>
        <div className="controls">
          <label>
            Spaltenanzahl:
            <input
              type="number"
              min="2"
              max="8"
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
            />
          </label>
          <label>
            Zeilenanzahl:
            <input
              type="number"
              min="4"
              max="11"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
          </label>
        </div>
        
        <div className="grid-container" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {generateCategoryHeaders()}
          {generateCells()}
        </div>
      </div>
    </div>
  );
};

export default QuizSpielen;
