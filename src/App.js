import React, {Component} from 'react';
import './App.css';
import TimeComponent from './components/time';
import Speech from 'react-speech';
import Talk from './components/talk';
import NavBar from './components/navbar';
import Welcome from './components/welcome';
import Player from './components/Player';
import { useSpeechSynthesis } from "react-speech-kit";
import Example from './components/talk';

const styleContainer = {
  color: "Gray"
}

class App extends Component{

constructor(props){
  super(props);
  this.state = { 
    coins: JSON.parse(localStorage.getItem('coins')) || [],
    selected: JSON.parse(localStorage.getItem('selected')) || [],
    myCoins: JSON.parse(localStorage.getItem('myCoins')) || [],
 }
}

getCoinsData = async () => {
  //https://agile-plateau-78718.herokuapp.com/
    fetch("http://localhost:8080/https://api.coincap.io/v2/assets/").then(
    res => res.json()).then(
      (result) => {
        this.setState({
          coins: result.data,
          selected: this.state.coins[0]
        }, () => {
          localStorage.setItem('coins', JSON.stringify(this.state.coins))
        });
        console.log(this.state.coins);
      },
      (error) => {
        //console.log('Yikes ' + error);
        this.getCoinsData();
      }
    )
}

getCoinIndex = (coinId) => {
  var i = 0;
  for (i; i<this.state.coins.length;i++){
    if (this.state.coins[i].id === coinId){
      return i;
    }
  }
  return -1;
}

updatePriceOfCoin = async () => {
  fetch("http://localhost:8080/https://api.coincap.io/v2/assets/").then(
    res => res.json()).then(
      (result) => {
        this.setState({
          coins: result.data
        }, () => {
          localStorage.setItem('coins', JSON.stringify(this.state.coins))
        });
        var i = 0;
        let myOldCoins = [...this.state.myCoins];
        for (i; i < this.state.myCoins.length; i++){
          let index = this.getCoinIndex(this.state.myCoins[i].id);
          
          // Make a shallow copy of the coin to be mutated
          let myOldCoin = {...myOldCoins[i]};
          // Replace it's old price with the new price
          myOldCoin.priceUsd = this.state.coins[index].priceUsd;
          // Replace the old coin with the new one
          myOldCoins[i] = myOldCoin;
        }

        this.setState({myCoins: myOldCoins},
          () => {
          localStorage.setItem('myCoins', JSON.stringify(this.state.myCoins))
        });

      },
      (error) => {
        //console.log('Yikes ' + error);
        this.updatePriceOfCoin();
      }
    )
}

// NOT USED
// Helper function that adds all available coins fetched to our "portfolio"
helperFunctionForAdding = async () => {
  for (var i=0; i<this.state.coins.length; i++){
    console.log(this.state.coins[i]);
    this.setState({myCoins: this.state.myCoins.concat(this.state.coins[i])})
  }
}

componentDidMount(){
  // Get all coins from the API at load time
  this.getCoinsData();
  // Update all coins once a day
  this.interval = setInterval(
    () => {
    this.getCoinsData()},
    1000 * 60 * 60 * 24
  );
  
  // Update prices of our "portfolio" coins once every 10 seconds
  this.interval = setInterval(
    () => {
      if (true) {
        this.updatePriceOfCoin();
      }
    },
    10000
  );
 
}

/* handleReset = () => {
    const counters = this.state.counters.map(c => {
        c.value = 0;
        return c;
    })
    this.setState({counters});
} */

handleChange = (selectedOptions) => {
  this.setState({selected: this.state.coins.find(el => el.id === selectedOptions.target.value)});
}

// Function that tells if a coin is already in our portfolio
// Returns True, if the coin id exists and False otherwise
coinOwned = (coinId) => {
  var i = 0;
  for (i; i<this.state.myCoins.length;i++){
    if (this.state.myCoins[i].id === coinId){
      return i;
    }
  }
  return -1;
}


handleSubmit = selected => {
  if (this.coinOwned(this.state.selected.id) !== -1){
    alert(this.state.selected.id + ' is added already!');
  }else {
    this.setState({myCoins: this.state.myCoins.concat(this.state.selected),
    selected: this.state.coins[0]}, () => {
      localStorage.setItem('myCoins', JSON.stringify(this.state.myCoins))
    })
  }
  selected.preventDefault();
}

delete(item){
  console.log(item.id);
  const myNewCoins = this.state.myCoins.filter(i => i.id !== item.id);
  this.setState({myCoins: myNewCoins},
    () => {
    localStorage.setItem('myCoins', JSON.stringify(this.state.myCoins))
  });
}

play(coin){
  console.log(coin.id);
}



  render(){
    const {coins, myCoins} = this.state;
    if (this.state.myCoins && this.state.myCoins.length > 0){
    return(
      <div className="page">
        <NavBar/>
        <Welcome/>
        <div className="container">
        <form onSubmit={this.handleSubmit}>
          <label>
            Choose a coin that you are interested in:
          <select className="form form-select" onChange={this.handleChange}>
            {coins.map(coin => {
              return (
                <option key={coin.id} value={coin.id}>{coin.id}</option>
              )
            })}
          </select>
          </label>
          <input type="submit" value="Submit"/>
        </form>
          <div className="coins">
            {myCoins.map(coin => (
              
                
                <div className="my-coins-container" key={coin.rank}>
                  <div className="my-coins">
                  <img src={"https://cryptologos.cc/logos/" + coin.id + "-" + coin.symbol.toLowerCase() + "-logo.png?v=013" } width="36" height="36" alt={coin.id}></img>
                  {"   "}{coin.id} ({coin.symbol}) - {Number(coin.priceUsd).toFixed(2)} $
                  </div>
                  <div className="my-buttons">
                  <Speech textAsButton={true} onClick={this.play.bind(this, coin)} displayText="PLAY" text={coin.id + "is" + Number(coin.priceUsd).toFixed(2) + "dollars"}></Speech>
                  <Player className="player" coin={coin}/>
                  <button className="btn btn-danger" onClick={this.delete.bind(this, coin)}>DEL</button>
                  </div>
                  <br style={{clear: 'both'}}/>
                </div>
              
              
            ))}
          </div>
        </div>
        <div className="empty-div"></div>
        <div className="footer">
          <TimeComponent/>
        </div>
      </div>
    );
  }
  else {
    return(
      <React.Fragment>
        <NavBar/>
        <Welcome/>
        <div className="container">
        <form onSubmit={this.handleSubmit}>
          <label>
            Choose a coin that you are interested in:
          <select className="form form-select" onChange={this.handleChange}>
            {coins.map(coin => {
              return (
                <option key={coin.id} value={coin.id}>{coin.id}</option>
              )
            })}
          </select>
          </label>
          <input type="submit" value="Submit"/>
        </form>
        </div>
        <div className="footer">
          <TimeComponent/>
        </div>
      </React.Fragment>
    );
  }
}
}

export default App;
