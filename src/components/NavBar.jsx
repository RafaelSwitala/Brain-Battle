import React from 'react';
import { Link } from 'react-router-dom';

import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <div className="navbar-logo"></div>
      </Link>
      <h2 className='navbarTitle'>Brain Battle</h2>
    </nav>
  );
};

export default NavBar;
