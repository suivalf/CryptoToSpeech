import React, { Component } from "react";
// Stateless Fuunctional Component
class NavBar extends Component {
  render() {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <a className="navbar-brand" href="/about">
          About
        </a>
      </nav>
    );
  }
}

export default NavBar;
