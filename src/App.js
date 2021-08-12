import React, {Component} from 'react';
import './App.css';
import TimeComponent from './components/time';
import Speech from 'react-speech';
import NavBar from './components/navbar';

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
    fetch("https://api.coincap.io/v2/assets/").then(
    res => res.json()).then(
      (result) => {
        this.setState({
          coins: result.data,
          selected: this.state.coins[0]
        }, () => {
          localStorage.setItem('coins', JSON.stringify(this.state.coins))
        });
        //console.log(this.state.coins);
      },
      () => {
        this.getCoinsData();
      }
    )
}

updatePriceOfCoin = async (coinId) => {
  fetch("https://api.coincap.io/v2/assets/" + coinId).then(
    res => res.json()).then(
      (result) => {
        // Make a shallow copy of the coins in "portfolio"
        let myOldCoins = [...this.state.myCoins];
        // Find the index of the coin in our "portfolio" that matches the 'coinId'
        var index = this.state.myCoins.findIndex(function(coin) {
          return coin.id === coinId;
        })
        // Make a shallow copy of the coin to be mutated
        let myOldCoin = {...myOldCoins[index]};
        // Replace it's old price with the new price
        myOldCoin.priceUsd = result.data.priceUsd;
        // Replace the old coin with the new one
        myOldCoins[index] = myOldCoin;
        this.setState({myCoins: myOldCoins},
          () => {
          localStorage.setItem('myCoins', JSON.stringify(this.state.myCoins))
        });

      },
      () => {
        this.updatePriceOfCoin(coinId);
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
        for (let i=0 ; i < this.state.myCoins.length; i++){
          this.updatePriceOfCoin(this.state.myCoins[i]['id']);
        }
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
      return true;
    }
  }
  return false;
}

handleSubmit = selected => {
  if (this.coinOwned(this.state.selected.id)){
    alert(this.state.selected.id + ' is added already!');
  }else {
    this.setState({myCoins: this.state.myCoins.concat(this.state.selected),
    selected: this.state.coins[0]}, () => {
      localStorage.setItem('myCoins', JSON.stringify(this.state.myCoins))
    })
  }
  selected.preventDefault();
}


  render(){
    const {coins, myCoins} = this.state;
    if (this.state.myCoins && this.state.myCoins.length > 0){
    return(
      <div>
        <NavBar/>
        <TimeComponent/>
        <div className="container" style={{width: 'device-width', initialScale: '1.0', margin: '0 auto'}}>
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
          <div>
            {myCoins.map(coin => (
              
              
                <div key={coin.rank}>
                <Speech text={Number(coin.priceUsd).toFixed(2)}>play</Speech>
                <img src={"https://cryptologos.cc/logos/" + coin.id + "-" + coin.symbol.toLowerCase() + "-logo.png?v=013" } width="36" height="36" alt={coin.id}></img>
                {coin.id} - {Number(coin.priceUsd).toFixed(2)}</div>
              
              
            ))}
          </div>
        </div>
      </div>
    );
  }
  else {
    return(
      <React.Fragment>
        <NavBar/>
        <TimeComponent/>
        <div className="container" style={{width: 'device-width', initialScale: '1.0', margin: '0 auto'}}>
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
      </React.Fragment>
    );
  }
}
}

export default App;
