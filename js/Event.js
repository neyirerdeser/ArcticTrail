var ArcticTrail = ArcticTrail || {};

ArcticTrail.Event = {};

ArcticTrail.Event.eventTypes = [
	//0
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'MuskOx',
    value: 1,
    text: 'Found wild ox. New ox: '
  },
	//1
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'Food',
    value: 20,
    text: 'Found arctic berries. Food added: '
  },
	//2
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'Food',
    value: 20,
    text: 'Found arctic berries. Food added: '
  },
	//3
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'Food', qty: 30, price: 50},
      {item: 'MuskOx', qty: 1, price: 100},
      {item: 'HuntingTools', qty: 2, price: 20},
      {item: 'Crew', qty: 25, price: 80}
    ]
  },
	//4
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop!',
    products: [
      {item: 'Food', qty: 20, price: 50},
      {item: 'MuskOx', qty: 1, price: 150},
      {item: 'HuntingTools', qty: 2, price: 50},
      {item: 'Crew', qty: 15, price: 80}
    ]
  },
	//5
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You came across a shop…',
    products: [
      {item: 'Food', qty: 20, price: 60},
			{item: 'MuskOx', qty: 1, price: 200},
      {item: 'HuntingTools', qty: 2, price: 80},
      {item: 'Crew', qty: 10, price: 90}
    ]
  },
	//6
	{
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'Food',
    value: -10,
    text: 'Mild frostbite. Food lost: '
  },
	//7
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'Crew',
    value: -4,
    text: 'Severe frostbite. Casualties: '
  },
	//8
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'MuskOx',
    value: -1,
    text: 'Your Musk Ox have been infected with worms. Worms thrive in warmer weather! Ox lost: '
  },
	//9
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'Food',
    value: -20,
    text: 'Polar bear stole your Food. Due to climate change, Polar bears need to use more energy to catch food and find land. Food lost: '
  },
	//10
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'MuskOx',
    value: -1,
    text: 'Polar bear stole your musk ox for Food. Polar bears need 12325 calories a day. Ox lost: '
  },
	//11
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Wolves are attacking you'
  },
	//12
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Wolves are attacking you'
  },
	//13
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Wolves are attacking you'
  }
];
ArcticTrail.Event.eventSpecTypes = [
	//0
  {
		type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'MuskOx',
    value: -2,
    text: 'You have reached Ayles Ice Shelf but it has cracked and broken off. This causes a decline in Arctic sea ice making it harder for wildlife and you to travel. Polar bears will be hungry...\nCasualties: '
	},
	//1
	{
		type: 'SHOP',
    notification: 'neutral',
    text: 'With less Ox with you, and your resources low, you are more likely to freeze without a winter coat. Make sure to grab some before it’s too late.',
    products: [
      {item: 'WinterCoat', qty: 1, price: 150},
			{item: 'WinterCoat', qty: 1, price: 150},
			{item: 'WinterCoat', qty: 1, price: 150},
			{item: 'WinterCoat', qty: 1, price: 150}
    ]
	},
	//2
	{
		type: 'STAT-CHANGE',
		notification: 'negative',
		stat: 'Crew',
		value: -10,
		text: 'Glaciers hold 1% of world’s land ice but melting it will cause 1/3 of the global sea level rise. The rising sea levels caused your crew to drown. Casualties: '

	},
	//3
	{
		type: 'STAT-CHANGE',
		notification: 'negative',
		stat: 'Food',
		value: -15,
		text: 'There is 770000 square miles less ice than 1981. Polar bears are declining for several reasons. With Ward Hunt Ice Shelf losing another 50km^2, more land mass was being lost. Polar bears need food, so ate your. Food lost:'
	
	},
	//4
	{
		type: 'STAT-CHANGE',
		notification: 'negative',
		stat: 'Crew',
		value: -15,
		text: 'Land mass has decreased in area due to higher temperatures, losing to half of the ice cap since 1979. This caused some of your crew to drown. Casualties: '

	}
];
ArcticTrail.Event.generateSpecEvent = function() {
	var eventData;
  if(this.caravan.Month>19 && this.caravan.Month<21) {
	 eventData = this.eventSpecTypes[0];
  } else if(this.caravan.Month>23 && this.caravan.Month<25) {
		eventData = this.eventSpecTypes[1];
	} else if(this.caravan.Month>67 && this.caravan.Month<69) {
		eventData = this.eventSpecTypes[2];
	} else if(this.caravan.Month>79 && this.caravan.Month<81) {
		eventData = this.eventSpecTypes[3];
	} else if(this.caravan.Month>104 && this.caravan.Month<106) {
		eventData = this.eventSpecTypes[4];
	} 
	//events that consist in updating a stat
	  if(eventData.type == 'STAT-CHANGE') {
		this.stateChangeEvent(eventData);
	  }

	  //shops
	  else if(eventData.type == 'SHOP') {
		//pause game
		this.game.pauseJourney();

		//notify user
		this.ui.notify(eventData.text, eventData.notification);

		//prepare event
		this.shopEvent(eventData);
	  }

	  //attacks
	  else if(eventData.type == 'ATTACK') {
		//pause game
		this.game.pauseJourney();

		//notify user
		this.ui.notify(eventData.text, eventData.notification);

		//prepare event
		this.attackEvent(eventData);
	  }
}

ArcticTrail.Event.generateEvent = function() {

	  //pick random one
	  var eventIndex = Math.floor(Math.random() * (this.eventTypes.length));
	  var eventData = this.eventTypes[eventIndex];
    
	  //events that consist in updating a stat
	  if(eventData.type == 'STAT-CHANGE') {
		this.stateChangeEvent(eventData);
	  }

	  //shops
	  else if(eventData.type == 'SHOP') {
		//pause game
		this.game.pauseJourney();

		//notify user
		this.ui.notify(eventData.text, eventData.notification);

		//prepare event
		this.shopEvent(eventData);
	  }

	  //attacks
	  else if(eventData.type == 'ATTACK') {
		//pause game
		this.game.pauseJourney();

		//notify user
		this.ui.notify(eventData.text, eventData.notification);

		//prepare event
		this.attackEvent(eventData);
	  }
	
};

ArcticTrail.Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.caravan[eventData.stat] >= 0) {
    this.caravan[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};

ArcticTrail.Event.shopEvent = function(eventData) {
  //number of products for sale
  var numProds = Math.ceil(Math.random() * 4);

  //product list
  var products = [];
  var j, priceFactor;

  for(var i = 0; i < numProds; i++) {
    //random product
    j = Math.floor(Math.random() * eventData.products.length);

    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }

  this.ui.showShop(products);
};

//prepare an attack event
ArcticTrail.Event.attackEvent = function(eventData){
  var HuntingTools = Math.round((0.7 + 0.6 * Math.random()) * ArcticTrail.ENEMY_HUNTINGTOOLS_AVG);
  var gold = Math.round((0.7 + 0.6 * Math.random()) * ArcticTrail.ENEMY_GOLD_AVG);

  this.ui.showAttack(HuntingTools, gold);
};
