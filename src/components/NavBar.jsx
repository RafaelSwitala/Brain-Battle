import React from 'react';
import { Link } from 'react-router-dom';

import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <div className="navbar-logo"></div>
      </Link>
      <div className="navbar-buttons-container">
        <Link to="/">
          <button className="navbar-buttons">Button1</button>
        </Link>
        <Link to="/">
          <button className="navbar-buttons">Button2</button>
        </Link>
        <Link to="/">
          <button className="navbar-buttons">Button3</button>
        </Link>
        <Link to="/">
          <button className="navbar-buttons">Einstellungen</button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
