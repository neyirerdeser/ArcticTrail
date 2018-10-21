var ArcticTrail = ArcticTrail || {};

ArcticTrail.Caravan = {};

ArcticTrail.Caravan.init = function(stats){
  this.Year = stats.Year;
  this.Month = stats.Month;
  this.Distance = stats.Distance;
  this.Crew = stats.Crew;
  this.Food = stats.Food;
  this.MuskOx = stats.MuskOx;
  this.Money = stats.Money;
  this.HuntingTools = stats.HuntingTools;
  this.Temperature = stats.Temperature;
	this.WinterCoat = stats.WinterCoat;
};

//update Weight and Capacity
ArcticTrail.Caravan.updateWeight = function(){
  var droppedFood = 0;
  var droppedGuns = 0;

  //how much can the caravan carry
  this.Capacity = this.MuskOx * ArcticTrail.WEIGHT_PER_OX + this.Crew * ArcticTrail.WEIGHT_PER_PERSON;

  //how much Weight do we currently have
  this.Weight = this.Food * ArcticTrail.FOOD_WEIGHT + this.HuntingTools * ArcticTrail.HUNTINGTOOLS_WEIGHT;

  //drop things behind if it's too much Weight
  //assume guns get dropped before Food
  while(this.HuntingTools && this.Capacity <= this.Weight) {
    this.HuntingTools--;
    this.Weight -= ArcticTrail.HUNTINGTOOLS_WEIGHT;
    droppedGuns++;
  }

  if(droppedGuns) {
    this.ui.notify('Left '+droppedGuns+' tool\(s\) behind', 'negative');
  }

  while(this.Food && this.Capacity <= this.Weight) {
    this.Food--;
    this.Weight -= ArcticTrail.FOOD_WEIGHT;
    droppedFood++;
  }

  if(droppedFood) {
    this.ui.notify('Left '+droppedFood+' food provisions behind', 'negative');
  }
};

//update covered Distance
ArcticTrail.Caravan.updateDistance = function() {
	ArcticTrail.TEMP_SLOWDOWN += 0.001;
  //the closer to Capacity, the slower
  var diff = this.Capacity - this.Weight;
  var speed = ArcticTrail.SLOW_SPEED + diff/this.Capacity * ArcticTrail.FULL_SPEED - ArcticTrail.TEMP_SLOWDOWN;
  this.Distance += speed;
};

//Food consumption
ArcticTrail.Caravan.consumeFood = function() {
  this.Food -= this.Crew * ArcticTrail.FOOD_PER_PERSON;

  if(this.Food < 0) {
    this.Food = 0;
  }
};

