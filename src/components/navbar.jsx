import React, { Component } from "react";
import { Link } from "react-router-dom";
import TimeComponent from "./time";
// Stateless Fuunctional Component
class NavBar extends Component {
  state = {};
  render() {
    return (
      <nav className="autohide navbar navbar-expand-lg navbar-dark bg-primary">
        <script src="navbar.js"></script>

        <div className="container-fluid">
          <Link to="">
            <a className="navbar-brand" href="">
              CTS
            </a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main_nav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="main_nav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/about">
                  <a className="nav-link" href="">
                    {" "}
                    About{" "}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
