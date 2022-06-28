import React from "react";
import logo from "../img/logo.png";
import "../App.css";

const Welcome = () => {
  return (
    <div className="welcome-div">
      <img src={logo} alt={"logo"} width="200" height="200"></img>
      <p className="welcome-message">Stay updated with the Crypto prices!</p>
      <p style={{ fontSize: 13 }} className="welcome-message">
        Select your favorite cryptocurrencies and a time interval when you wish
        to be audio informed about the live prices then press play.
      </p>
    </div>
  );
};

export default Welcome;
