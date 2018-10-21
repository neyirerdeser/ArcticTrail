var ArcticTrail = ArcticTrail || {};

ArcticTrail.UI = {};

//show a notification in the message area
ArcticTrail.UI.notify = function(message, type){
     document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Year '+ Math.floor(this.caravan.Year) + ' , ' + 'Month '+ Math.ceil(this.caravan.Month % 12) + ': ' + message+'</div>'+  document.getElementById('updates-area').innerHTML;
};

//refresh visual caravan stats
ArcticTrail.UI.refreshStats = function() {
  //modify the dom
  document.getElementById('stat-Month').innerHTML = Math.ceil(this.caravan.Month);
  document.getElementById('stat-Year').innerHTML = Math.floor(this.caravan.Year);
  document.getElementById('stat-Distance').innerHTML = Math.floor(this.caravan.Distance);
  document.getElementById('stat-Crew').innerHTML = this.caravan.Crew;
  document.getElementById('stat-MuskOx').innerHTML = this.caravan.MuskOx;
  document.getElementById('stat-Food').innerHTML = Math.ceil(this.caravan.Food);
  document.getElementById('stat-Money').innerHTML = this.caravan.Money;
  document.getElementById('stat-HuntingTools').innerHTML = this.caravan.HuntingTools;
  document.getElementById('stat-Weight').innerHTML = Math.ceil(this.caravan.Weight) + '/' + this.caravan.Capacity;
	document.getElementById('stat-Temperature').innerHTML = ''+Math.round(this.caravan.Temperature*10)/10+' °C';
	document.getElementById('stat-WinterCoat').innerHTML = this.caravan.WinterCoat;
  //update caravan position
  document.getElementById('caravan').style.left = (380 * this.caravan.Distance/ArcticTrail.FINAL_DISTANCE) + 'px';
};

//show shop
ArcticTrail.UI.showShop = function(products){

  //get shop area
  var shopDiv = document.getElementById('shop');
  shopDiv.classList.remove('hidden');

  //init the shop just once
  if(!this.shopInitiated) {

    //event delegation
    shopDiv.addEventListener('click', function(e){
      //what was clicked
      var target = e.target || e.src;

      //exit button
      if(target.tagName == 'BUTTON') {
        //resume journey
        shopDiv.classList.add('hidden');
        ArcticTrail.UI.game.resumeJourney();
      }
      else if(target.tagName == 'DIV' && target.className.match(/product/)) {

        console.log('buying')

        var bought = ArcticTrail.UI.buyProduct({
          item: target.getAttribute('data-item'),
          qty: target.getAttribute('data-qty'),
          price: target.getAttribute('data-price')
        });

        if(bought) target.html = '';
      }
    });

    this.shopInitiated = true;
  }

  //clear existing content
  var prodsDiv = document.getElementById('prods');
  prodsDiv.innerHTML = '';

  //show products
  var product;
  for(var i=0; i < products.length; i++) {
    product = products[i];
    prodsDiv.innerHTML += '<div class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
  }

  //setup click event
  document.getElementsByClassName('product').addEventListener(ArcticTrail.UI.buyProduct);
};

//buy product
ArcticTrail.UI.buyProduct = function(product) {
  //check we can afford it
  if(product.price > ArcticTrail.UI.caravan.Money) {
    ArcticTrail.UI.notify('Not enough Money', 'negative');
    return false;
  }

  ArcticTrail.UI.caravan.Money -= product.price;

  ArcticTrail.UI.caravan[product.item] += +product.qty;

  ArcticTrail.UI.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');

  //update Weight
  ArcticTrail.UI.caravan.updateWeight();

  //update visuals
  ArcticTrail.UI.refreshStats();

  return true;

};

//show attack
ArcticTrail.UI.showAttack = function(HuntingTools, gold) {
  var attackDiv = document.getElementById('attack');
  attackDiv.classList.remove('hidden');

  //keep properties
  this.HuntingTools = HuntingTools;
  this.gold = gold;

  //show HuntingTools
  document.getElementById('attack-description').innerHTML = 'Number of Wolves: ' + HuntingTools;

  //init once
  if(!this.attackInitiated) {

    //fight
    document.getElementById('fight').addEventListener('click', this.fight.bind(this));

    //run away
    document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

    this.attackInitiated = true;
  }
};

//fight
ArcticTrail.UI.fight = function(){

  var HuntingTools = this.HuntingTools;
  var gold = this.gold;

  var damage = Math.ceil(Math.max(0, HuntingTools * 2 * Math.random() - this.caravan.HuntingTools));

  //check there are survivors
  if(damage < this.caravan.Crew) {
    this.caravan.Crew -= damage;
    this.caravan.Money += gold;
    this.notify(damage + ' people were killed fighting', 'negative');
    this.notify('Sold pelts. Gained $' + gold, 'gold');
  }
  else {
    this.caravan.Crew = 0;
    this.notify('Everybody died in the fight', 'negative');
  }

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();
};

//runing away from enemy
	ArcticTrail.UI.runaway = function(){

  var HuntingTools = this.HuntingTools;

  var damage = Math.ceil(Math.max(0, HuntingTools * Math.random()/2));

  //check there are survivors
  if(damage < this.caravan.Crew) {
    this.caravan.Crew -= damage;
    this.notify(damage + ' people were killed running', 'negative');
  }
  else {
    this.caravan.Crew = 0;
    this.notify('Everybody died running away', 'negative');
  }

  //remove event listener
  //document.getElementById('runaway').removeEventListener('click');
  // this was buggy

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();

};
