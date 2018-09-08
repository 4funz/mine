import React, { Component } from 'react';




class Mine extends Component {

constructor(props) {
  super(props);
  this.state = { 
    gold: 450, 
    lumber: 1000,
    userLvl: 1, 
    goldMine: {
      goldCost: 60,
      lumberCost: 150,
      goldCostDelta: 0,
      lumberCostDelta: 0,
      lvl: 1,
      prod: 10,
      upgradePossible: true,
      costMod: 1.6,
      baseProdMod: 1.2,
      baseProd: 4,
      src: '\public\img\Gold-Ingot-icon.png',
      error: <h1>No errors!</h1>

    },
    lumberMine: {
      goldCost: 25,
      lumberCost: 100,
      goldCostDelta: 0,
      lumberCostDelta: 0,
      lvl: 1,
      prod: 10,
      upgradePossible: true,
      costMod: 1.2,
      baseProdMod: 1.6,
      baseProd: 8,
      src: '\public\img\Gold-Ingot-icon.png',
      error: <h1>No errors!</h1>
    },

    error: false,
  
    

  }

  this.upgradeMine = this.upgradeMine.bind(this)
  this.errorUpdate = this.errorUpdate.bind(this)
  this.clearError = this.clearError.bind(this)
  this.deleteLocalStorage = this.deleteLocalStorage.bind(this)
  this.updateMine = this.updateMine.bind(this)

  this.upgradeGold = this.upgradeGold.bind(this)
  this.upgradeLumber = this.upgradeLumber.bind(this)
  this.upgradePossibleCheck = this.upgradePossibleCheck.bind(this)
  this.upgradeCheck = this.upgradeCheck.bind(this)
 
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
    gold: 450, 
    lumber: 1000,
    userLvl: 1, 
    goldMine: {
      goldCost: 60,
      lumberCost: 150,
      lvl: 1,
      prod: 10,
      upgradePossible: true,
      costMod: 1.6,
      baseProdMod: 1.2,
      baseProd: 4,
      src: '\public\img\Gold-Ingot-icon.png',

    },
    lumberMine: {
      goldCost: 25,
      lumberCost: 100,
      lvl: 1,
      prod: 10,
      upgradePossible: true,
      costMod: 1.2,
      baseProdMod: 1.6,
      baseProd: 8,
      src: '\public\img\Gold-Ingot-icon.png',

    },

    error: false,
  
    



  })
}


componentDidMount() {

  this.timerID = setInterval(
    () => this.upgradeCheck(),
    3000
  );
  this.timerID = setInterval(
    () => this.updateResources(),
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


upgradeCheck(){
  this.upgradePossibleCheck('goldMine');
  this.upgradePossibleCheck('lumberMine');

}

upgradePossibleCheck(type) {


  if (this.state.gold < this.state[type].goldCost) {

    let goldDiff = this.state[type].goldCost - this.state.gold

    let newObj = { ...this,state[type], upgradePossible: false, goldCostDelta: goldDiff}
    this.setState({
      [type]: newObj
    })

    this.upgradeCountdown(type)
   

  } if (this.state.lumber < this.state[type].lumberCost) {
 
    let lumberDiff = this.state[type].lumberCost - this.state.lumber

    let newObj = { ...this,state[type], upgradePossible: false, goldCostDelta: goldDiff}
    this.setState({
      [type]: newObj
    })

    this.upgradeCountdown(type)

  
  } else {

    this.clearError;
  }

}

upgradeCountdown() {


}

componentWillUnmount() {
  clearInterval(this.timerID);
  /* window.removeEventListener(
    "beforeunload",
    this.saveStateToLocalStorage.bind(this)
  );

  // saves if component has a chance to unmount
  this.saveStateToLocalStorage();  */

}

upgradeGold(){
  this.upgradeMine('goldMine')
}

upgradeLumber(){
  this.upgradeMine('lumberMine')
}

upgradeMine(type) {


  if(this.state.gold >= this.state[type].goldCost  &&  this.state.lumber >= this.state[type].lumberCost ) {

    this.setState({
      
      gold: this.state.gold - this.state[type].goldCost,
      lumber: this.state.lumber - this.state[type].lumberCost,
    })
    let newObj = { ...this.state[type], lvl: this.state[type].lvl++ }
    this.setState({
      [type]: newObj
      
    })
    
 
    
    this.updateMine(type)

   } else {

    this.errorUpdate()

  } 
 
} 

updateMine(type) {

  let currentLevel = this.state[type].lvl;
  let prodBase = this.state[type].baseProd; 
  let baseMod = this.state[type].baseProdMod

  let cost =  Math.round((prodBase *  currentLevel  * baseMod))
 
 
  let baseCostGold = this.state[type].goldCost;
  let baseCostLumber = this.state[type].lumberCost;
  let costMod = this.state[type].costMod;

  let nextUpgradeCostGold =  Math.round( (currentLevel * baseCostGold  * costMod));
  let nextUpgradeCostLumber =  Math.round( (currentLevel * baseCostLumber  * costMod)); 

  let newObjOne = { ...this.state[type], goldCost: nextUpgradeCostGold, lumberCost: nextUpgradeCostLumber, prod: cost}
  this.setState({
    [type]: newObjOne

  })
}
  

updateResources(){
  this.setState({
    gold: this.state.gold + this.state.goldMine['prod'],
    lumber: this.state.lumber + this.state.lumberMine['prod'],

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
  };

    return (
      <div id="wrapper">
       <div id="gold">Gold <span id="resource-counter">{this.state.gold}</span></div>
      <div id="lumber">Lumber <span id="resource-counter">{this.state.lumber}</span></div>
       <div id="player">Player level <span id="resource-counter">{this.state.userLvl}</span> </div> 

      <div id="gold-mine">Mine level {this.state.goldMine['lvl']} | Production {this.state.goldMine['prod']} </div>
        <button id="gold-button"  onClick={this.upgradeGold}>Upgrade Gold -> {this.state.goldMine.goldCost} G | {this.state.goldMine.lumberCost} L</button>


        <div id="lumber-mine">Mine level {this.state.lumberMine.lvl} | Production {this.state.lumberMine.prod}</div>
        <button id="lumber-button" /* disabled={this.state.lumberMine.upgradePossible} */ onClick={this.upgradeLumber}> Upgrade Lumber -> {this.state.lumberMine.goldCost} G | {this.state.lumberMine.lumberCost} L</button> 
 
        
        {errorButton}
                
       <button id="new-game" onClick={this.deleteLocalStorage}>Start new game</button>
        
 
      </div>
       
      


     );

  
  

  }

}
export default Mine;
