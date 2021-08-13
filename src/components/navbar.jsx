import React, { Component } from "react";
import { Link } from "react-router-dom";
import TimeComponent from "./time";
// Stateless Fuunctional Component
class NavBar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          CTS
        </a>
        <a className="navbar-about" href="/about">
          About
        </a>
      </nav>
    );
  }
}

export default NavBar;
