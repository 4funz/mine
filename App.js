import React, { Component } from 'react';




class Mine extends Component {

constructor(props) {
  super(props);
  this.state = { 
    gold: 1000, 
    lumber: 1000,
    userLvl: 1, 
    goldLvl: 1, 
    lumberLvl: 1, 
    mineProd: [1, 5, 10, 15, 20, 25, 30, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
    mineUpgradeCostGold: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    mineUpgradeCostLumber: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    error: false



  
  
  }
  this.upgradeGoldMine = this.upgradeGoldMine.bind(this)
  this.upgradeLumberMine = this.upgradeLumberMine.bind(this)
  this.errorUpdate = this.errorUpdate.bind(this)
  this.clearError = this.clearError.bind(this)
  this.deleteLocalStorage = this.deleteLocalStorage.bind(this)

  
 



}


saveStateToLocalStorage() {
  // for every item in React state
  for (let key in this.state) {
    // save to localStorage
    localStorage.setItem(key, JSON.stringify(this.state[key]));
  }
}

 hydrateStateWithLocalStorage() {
  // for all items in state
  for (let key in this.state) {
    // if the key exists in localStorage
    if (localStorage.hasOwnProperty(key)) {
      // get the key's value from localStorage
      let value = localStorage.getItem(key);

      // parse the localStorage string and setState
      try {
        value = JSON.parse(value);
        this.setState({ [key]: value });
      } catch (e) {
        // handle empty string
        this.setState({ [key]: value });
      }
    }
  }
}
deleteLocalStorage() {
  // for every item in React state
  for (let key in this.state) {
    // save to localStorage
    //localStorage.setItem(key, JSON.stringify(this.state[key]));
    localStorage.removeItem(key);
  }

  this.setState({
    gold: 1000,
    lumber: 1000,
    userLvl: 1,
    goldLvl: 1,
    lumberLvl: 1,


  })
}


componentDidMount() {

  
  this.timerID = setInterval(
    () => this.upgradePossible(),
    3000
  );
  this.timerID = setInterval(
    () => this.productionMine(),
    3000
  );

  this.hydrateStateWithLocalStorage();

    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
}



componentWillUnmount() {
  clearInterval(this.timerID);
  window.removeEventListener(
    "beforeunload",
    this.saveStateToLocalStorage.bind(this)
  );

  // saves if component has a chance to unmount
  this.saveStateToLocalStorage(); 

}

upgradeGoldMine() {
if(this.state.gold > this.state.mineUpgradeCostGold[this.state.goldLvl + 1] && this.state.lumber > this.state.mineUpgradeCostLumber[this.state.goldLvl + 1]) {
  this.setState({
    goldLvl: this.state.goldLvl + 1,
    gold: this.state.gold - this.state.mineUpgradeCostGold[this.state.goldLvl+1],
    lumber: this.state.lumber -this.state.mineUpgradeCostLumber[this.state.goldLvl+1]
  })

  }
  else {

    this.errorUpdate()

  }
} 

upgradeLumberMine() {
  if(this.state.gold > this.state.mineUpgradeCostGold[this.state.lumberLvl + 1] && this.state.lumber > this.state.mineUpgradeCostLumber[this.state.lumberLvl + 1]) {
    this.setState({
      lumberLvl: this.state.lumberLvl + 1,
      gold: this.state.gold - this.state.mineUpgradeCostGold[this.state.goldLvl+1],
      lumber: this.state.lumber - this.state.mineUpgradeCostLumber[this.state.goldLvl+1]
    })

  }
  else {

    this.errorUpdate()

  }

}


upgradePossible(){
if(this.state.gold > this.state.mineUpgradeCostGold[this.state.goldLvl + 1] && this.state.lumber > this.state.mineUpgradeCostLumber[this.state.goldLvl + 1]) {
this.clearError();

} else if (this.state.gold > this.state.mineUpgradeCostGold[this.state.lumberLvl + 1] && this.state.lumber > this.state.mineUpgradeCostLumber[this.state.lumberLvl + 1]) {
  this.clearError();
}

}


productionMine() {
  this.setState({
    gold: this.state.gold + this.state.mineProd[this.state.goldLvl],
    lumber: this.state.lumber + (this.state.mineProd[this.state.lumberLvl] / 4) * (this.state.lumberLvl * 1.2)
  })
}


errorUpdate(){
  this.setState({
    error: true
  })
}


clearError(){
  this.setState({
    error: false
  })
}


render() {
  let errorButton;
  if(this.state.error) {
    errorButton = <div>
    <h1>Not enough resources</h1>
    <button onClick={this.clearError}>Clear error</button>
    </div>
  }

    return (
      <div id="wrapper">
        <div id="gold">Gold <span id="resource-counter">{this.state.gold}</span></div>
        <div id="lumber">Lumber <span id="resource-counter">{this.state.lumber}</span></div>
        <div id="player">Player level <span id="resource-counter">{this.state.userLvl}</span> </div>

        <div id="gold-mine">Mine level {this.state.goldLvl} | Production {this.state.mineProd[this.state.goldLvl]} </div>
        <button id="gold-button" onClick={this.upgradeGoldMine}>Upgrade Gold</button>

        <div id="lumber-mine">Mine level {this.state.lumberLvl} | Production {(this.state.mineProd[this.state.lumberLvl] / 4) * (this.state.lumberLvl * 1.2)}</div>
        <button id="lumber-button" onClick={this.upgradeLumberMine}>Upgrade Lumber</button>
        
        {errorButton}
                
       <button id="new-game" onClick={this.deleteLocalStorage}>Start new game</button>
        

        </div>
       
      


     );

  
  

  }

}

export default Mine;
