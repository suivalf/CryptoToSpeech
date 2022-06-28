import React, {Component} from 'react';
import './App.css';
import TimeComponent from './components/time';
import NavBar from './components/navbar';
import Welcome from './components/welcome';


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
          //selected: this.state.coins[0]
        }, () => {
          localStorage.setItem('coins', JSON.stringify(this.state.coins))
        });
        //console.log(this.state.coins);
      },
      (error) => {
        console.log(error);
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
  fetch("https://api.coincap.io/v2/assets/").then(
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
          //console.log(this.state.coins[index].priceUsd);
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
        console.log(error);
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
  //clear storage in case of bugs (for development only)
  //localStorage.clear();
  // Get all coins from the API at load time
  this.getCoinsData();
  this.updatePriceOfCoin();
  // Update all coins once per minute
  this.interval = setInterval(
    () => {
    this.getCoinsData()},
    1000 * 60
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
  console.log(selectedOptions.target.value);
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
  //console.log(this.state.selected.id);
  if (this.coinOwned(this.state.selected.id) !== -1 && this.state.selected.id !== undefined){
    alert(this.state.selected.id + ' is added already!');
  }else if (this.state.selected.id !== undefined){
    this.setState({myCoins: this.state.myCoins.concat(this.state.selected)}, () => {
      localStorage.setItem('myCoins', JSON.stringify(this.state.myCoins))
    })
  }else{
    alert('Choose an option first.');
  }
  selected.preventDefault();
}

delete(item){
  //console.log(item.id);
  const myNewCoins = this.state.myCoins.filter(i => i.id !== item.id);
  this.setState({myCoins: myNewCoins},
    () => {
    localStorage.setItem('myCoins', JSON.stringify(this.state.myCoins))
  });
}

play(coin){
  console.log(coin.id);
}

formatPrice(price){
  if (price < 1){
    return Number(price).toFixed(3);
  }else if (price < 100){
    return Number(price).toFixed(2);
  }else if (price < 1000){
    return Number(price).toFixed(1);
  }else{
    return Number(price).toFixed(0);
  }
}

handleChange2 = (selectedOptions) => {
  localStorage.setItem(selectedOptions.target.className, selectedOptions.target.value);
  //console.log(selectedOptions.target.className);
  //console.log(selectedOptions.target.value);
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
          <select className="dropdown-items" onChange={this.handleChange} defaultValue={'DEFAULT'}>
          <option value="DEFAULT" disabled>Choose from here</option>
            {coins.map(coin => {
              return (
                <option className="dropdown-items" key={coin.id} value={coin.id}>{coin.id}</option>
              )
            })}
          </select>
         
          <input className="submit" type="submit" value="Add"></input>
        </form>
        <br/>
          <div className="coins">
            {myCoins.map(coin => (
              
          
                <div className="my-coins-container" key={coin.rank}>
                 
                  <div className="my-coins">
                  <img src={"https://cryptologos.cc/logos/" + coin.id + "-" + coin.symbol.toLowerCase() + "-logo.png?v=013" } width="36" height="36" alt={coin.id}></img>
                  {"   "} {coin.symbol} - <span className="price-paragraph" id={coin.id}>{this.formatPrice(coin.priceUsd)} </span> $ 
                  
                  </div>

                  <div className="my-delay">
                    <form>
                      <select className={`timer-${coin.id}`} onChange={this.handleChange2} id="5" defaultValue={5}>
                        <option className='timer-option' value="5" disabled>Change timer</option>
                        <option className='timer-option' value="10">10 seconds</option>
                        <option className='timer-option' value="30">30 seconds</option>
                        <option className='timer-option' value="60">1 minute</option>
                        <option className='timer-option' value="300">5 minutes</option>
                        <option className='timer-option' value="600">10 minutes</option>
                        <option className='timer-option' value="1800">30 minutes</option>
                        <option className='timer-option' value="3600">1 hour</option>
                        <option className='timer-option' value="7200">2 hours</option>
                      </select>
                    </form>
                  </div>
           
                  <div className="my-buttons">
                  <button value="play" className="play-button" onClick={(e) => {
                    var price = new window.SpeechSynthesisUtterance();
                    if (e.target.className === "fa fa-play"){
                      e.target.className = "fa fa-pause";
                      
                      this.interval = setInterval(
                        () => {
                          if (document.getElementById(coin.id) != null){
                            price.text = coin.id + " is ";
                            price.text = price.text + document.getElementById(coin.id).innerText;
                            price.text = price.text + "$";
                          
                          price.lang = 'en';
                          window.speechSynthesis.speak(price);
                          //console.log(localStorage.getItem("timer-"+coin.id))
                          }else{
                            clearInterval();
                          }
                          },
                        1000 * localStorage.getItem("timer-"+coin.id)
                      );
                      localStorage.setItem(coin.id, this.interval);
                    }else{
                      clearInterval(localStorage.getItem(coin.id));
                      window.speechSynthesis.cancel(price);
                      e.target.className = "fa fa-play";
                    }
                       
                        
                    }}><i className="fa fa-play"></i></button>
                  <button className="delete-button" onClick={this.delete.bind(this, coin)}><i className="fa fa-window-close"></i></button>
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
        <select className="dropdown-items" onChange={this.handleChange} defaultValue={'DEFAULT'}>
          <option value="DEFAULT" disabled>Choose from here</option>
            {coins.map(coin => {
              return (
                <option className="items" key={coin.id} value={coin.id}>{coin.id}</option>
              )
            })}
          </select>
          
          <input className="submit" type="submit" value="Add"/>
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
