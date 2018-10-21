var ArcticTrail = ArcticTrail || {};

//constants
ArcticTrail.WEIGHT_PER_OX = 20;
ArcticTrail.WEIGHT_PER_PERSON = 2;
ArcticTrail.FOOD_WEIGHT = 0.6;
ArcticTrail.HUNTINGTOOLS_WEIGHT = 5;
ArcticTrail.GAME_SPEED = 600;
ArcticTrail.YEAR_PER_STEP = 1/60;
ArcticTrail.MONTH_PER_STEP = 0.2;
ArcticTrail.FOOD_PER_PERSON = 0.02;
ArcticTrail.FULL_SPEED = 3;
ArcticTrail.SLOW_SPEED = 1;
ArcticTrail.FINAL_DISTANCE = 1000;
ArcticTrail.EVENT_PROBABILITY = 0.15;
ArcticTrail.SPEC_PROBABILITY = 0;
ArcticTrail.ENEMY_HUNTINGTOOLS_AVG = 5;
ArcticTrail.ENEMY_GOLD_AVG = 50;
ArcticTrail.INCREASE_IN_TEMP = 275/9900;
//variable
ArcticTrail.TEMP_SLOWDOWN = 0;

ArcticTrail.Game = {};

//initiate the game
ArcticTrail.Game.init = function(){

  //reference ui
  this.ui = ArcticTrail.UI;

  //reference event manager
  this.eventManager = ArcticTrail.Event;

  //setup caravan
  this.caravan = ArcticTrail.Caravan;
  this.caravan.init({
    Month: 0,
    Distance: 0,
    Crew: 30,
    Food: 100, //80
    MuskOx: 3,
    Money: 300,
    HuntingTools: 2,
    Temperature: -35,
    Year: 0,
    WinterCoat: 0
  });

  //pass references
  this.caravan.ui = this.ui;
  this.caravan.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.caravan = this.caravan;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.caravan = this.caravan;
  this.eventManager.ui = this.ui;

  //begin adventure!
  this.startJourney();
};

//start the journey and time starts running
ArcticTrail.Game.startJourney = function() {
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('Welcome to Ellesmere Island! Located between Greenland and the Artic Circle, Ellesmere is where you will begin your journey to the Arctic.', 'positive');

  this.step();
};

//game loop
ArcticTrail.Game.step = function(timestamp) {

  //starting, setup the previous time for the first time
  if(!this.previousTime){
    this.previousTime = timestamp;
    this.updateGame();
  }

  //time difference
  var progress = timestamp - this.previousTime;

  //game update
  if(progress >= ArcticTrail.GAME_SPEED) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  //we use "bind" so that we can refer to the context "this" inside of the step method
  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

//update game stats
ArcticTrail.Game.updateGame = function() {
	
  //Month update
  this.caravan.Month += ArcticTrail.MONTH_PER_STEP;
	//temp update
  this.caravan.Temperature += ArcticTrail.INCREASE_IN_TEMP;
    //Year update
  this.caravan.Year += ArcticTrail.YEAR_PER_STEP;

	
  //Food consumption
  this.caravan.consumeFood();

  if(this.caravan.Food === 0) {
    this.ui.notify('Your caravan starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  //update Weight
  this.caravan.updateWeight();

  //update progress
  this.caravan.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.caravan.Crew <= 0) {
    this.caravan.Crew = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  //check win game
  if(this.caravan.Distance >= ArcticTrail.FINAL_DISTANCE) {
    this.ui.notify('You have reached your destination!', 'positive');
    this.gameActive = false;
    return;
  }
	//NEYIR
	
	if((Math.round(this.caravan.Month*1000)/1000)==20 || (Math.round(this.caravan.Month*1000)/1000)==24 || (Math.round(this.caravan.Month*1000)/1000)==68 || (Math.round(this.caravan.Month*1000)/1000)==80 || (Math.round(this.caravan.Month*1000)/1000)==105) {
		this.eventManager.generateSpecEvent();
	}
	
	//NEYIR
	
	//random events
	if (Math.random() <= ArcticTrail.EVENT_PROBABILITY) {
		this.eventManager.generateEvent();
	}

	

};

//pause the journey
ArcticTrail.Game.pauseJourney = function() {
  this.gameActive = false;
};

//resume the journey
ArcticTrail.Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
};


//init game
ArcticTrail.Game.init();
