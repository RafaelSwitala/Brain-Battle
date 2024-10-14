import React from 'react';
import { Link } from 'react-router-dom';

import './Accordion.css';

const Accordion = () => {
  return (
    <div className="accordion">
      <div className="accordion-content">
        <Link to="/">Home</Link>
        <Link to="/ChallengeYourCategories">Challenge Your Categories</Link>
        <Link to="/Page2">Page2</Link>
        <Link to="/Page3">Page3</Link>
      </div>
    </div>
  );
};

export default Accordion;
