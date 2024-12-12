import React from 'react';

const QuizGrid = ({ categories, sortedPoints, handleCellClick, answeredQuestions, categorizedQuestions }) => {
  return (
    <div className='mainPage-container quiz-container'>
      <div className="grid-container" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
        {categories.map((category, index) => (
          <div key={index} className="grid-cell category-header">{category}</div>
        ))}
        {sortedPoints.map((points) => (
          <React.Fragment key={points}>
            {categories.map((category) => {
              const questions = categorizedQuestions[category][points] || [];
              return questions.map((question, questionIndex) => (
                <div
                  key={`${category}-${questionIndex}`}
                  className={`grid-cell ${answeredQuestions.has(question) ? 'answered' : ''}`}
                  onClick={() => handleCellClick(question)}
                >
                  {points}
                </div>
              ));
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default QuizGrid;
