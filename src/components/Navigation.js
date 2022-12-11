import React from 'react';
import { Link } from 'react-router-dom';
import '../css/style.css';

const Navigation = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-div">
        <Link to="/" className="nav-li">
          HOME
        </Link>
      </div>
      <div className="nav-div">
        <Link to="/profile" className="nav-li">
          My Page
        </Link>
      </div>
    </nav>
  );
};
export default Navigation;
