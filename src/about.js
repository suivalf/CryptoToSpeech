import React from 'react';
import NavBar from './components/navbar';
import TimeComponent from './components/time';
function About() {

    return (
        <React.Fragment>
        <NavBar/>
      <div>
        <p style={{fontSize: 20, marginLeft: 10, marginTop: 10, lineHeight: 1.3, letterSpacing: -0.5, textIndent: 20}}>
          Are you invested into crypto currencies but you are just too busy to check their prices 10 times per hour?
          <br></br>
          Don't worry, you can use this website to stay informed about your favorite coins while you work, play or make dinner.
          <br></br>
          The prices are updated live a few times per minute using CoinCap API. Choose which coins you want to monitor closely from the drop-down menu, 
          select a time interval for the price to be played and press the play button. You can choose multiple coins with different time delays and also
          remove them from your "portfolio".
        </p>
        
      </div>
      <div className="footer">
          <TimeComponent/>
        </div>
      </React.Fragment>
    );

}

export default About;