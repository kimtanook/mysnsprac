import React from "react";
import {Link} from "react-router-dom";
import homeIcon from "../images/home_logo.png";
import authIcon from "../images/auth_logo.jpg";
import logo2 from "../images/logo2.png";

const Navigation = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-div">
        <Link to="/">
          <img className="nav-li" src={homeIcon} />
        </Link>
      </div>
      <div className="nav-div">
        <Link to="/profile">
          <img className="nav-li" src={authIcon} />
        </Link>
      </div>
      <img className="logo2" src={logo2} />
    </nav>
  );
};
export default Navigation;
