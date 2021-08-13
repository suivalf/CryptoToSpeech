import React, { Component } from "react";
import logo from "../img/logo.png";
import "../App.css";

const Welcome = () => {
  return (
    <div className="welcome-div">
      <img src={logo} alt={"logo"} width="200" height="200"></img>
      <p className="welcome-message">Stay updated with the Crypto prices!</p>
    </div>
  );
};

export default Welcome;
