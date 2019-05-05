class Card{
  constructor(locX, locY, content){
    // PROPS
    this.locX = locX;
    this.locY = locY;
    this.content = content
    this.htmlElement = this.createCard();
    this.imgElement = this.addImage();
    this.isRevealed = false;
    // Init card
    this.hideImage(false);
    this.realignCard();
    // Clickable
    this.htmlElement.addEventListener("click", this.htmlElementOnClick.bind(this));
    // CANDY
    this.animationQueue = [];
    this.animationBusy = false;
    this.animationProgress = 0;
  };

  createCard(){
    var tempCard = document.createElement("div");
    tempCard.className = "card";
    htmlGrid.appendChild(tempCard);
    return tempCard;
  }

  realignCard(){
      this.htmlElement.style.left = this.locX + "px";
      this.htmlElement.style.top = this.locY + "px";
  }

  addImage(cardType){
    var tempContent = document.createElement("img")
    this.htmlElement.appendChild(tempContent);
    tempContent.src = this.content.link;
    return tempContent
  }

  htmlElementOnClick(){
    grid.trackMoves();
    if (this.isRevealed === false){
      this.showImage(true);
      grid.rememberReveal(this);
    } else {
      this.hideImage(true);
      grid.undoReveal(this);
    }
    if (grid.timeElapsed === -1){
      grid.timeTick();
    }
  }

  hideImage(wantAnimation){
    this.isRevealed = false;
    console.log("ZZZZ");
    if (wantAnimation === true){
      this.queueAnimation("hide");
    } else {
      this.imgElement.style.display = "none";
    }
  }

  showImage(wantAnimation){
    this.imgElement.style.display = "block";
    this.isRevealed = true;
    if (wantAnimation === true){
      this.queueAnimation("show");
    }
  }

  hideHtmlElement(wantAnimation){
    console.log("BBBBB");
    if (wantAnimation === true){
      this.queueAnimation("dismantle")
    } else {
      this.htmlElement.style.display = "none";
    }
  }

  queueAnimation(whichAnimation){
    this.animationQueue.push(whichAnimation);
    this.runAnimations();
  }

  runAnimations(){
    console.log(this.animationQueue);
    if (this.animationBusy === false && this.animationQueue.length !== 0){
      this.runNextAnimation();
    }
  }

  runNextAnimation(){
    this.animationBusy = true;
    this.animationProgress = 0;
    if (this.animationQueue[0] === "show"){
      this.runAnimationShow();
    }
    if (this.animationQueue[0] === "hide"){
      this.runAnimationHide();
    }
    if (this.animationQueue[0] === "wait"){
      this.runAnimationWait();
    }
    if (this.animationQueue[0] === "dismantle"){
      this.runAnimationDismantle();
    }
  }

  runAnimationShow(){
    if (this.animationProgress < 100){
      window.setTimeout(this.runAnimationShow.bind(this), 1);
      this.animationProgress = this.animationProgress + 2;
      if (this.animationProgress <= 40){
        this.htmlElement.style.left = this.locX + (50/40) * this.animationProgress + "px";
        this.htmlElement.style.width = (100 - 2.5 * this.animationProgress) + "px";
        this.imgElement.style.display = "none";
      }
      if (this.animationProgress > 60){
        this.htmlElement.style.left = this.locX + 50 - (50/40) * (this.animationProgress - 60) + "px"
        this.htmlElement.style.width = (-150 + 2.5 * this.animationProgress) + "px";
        this.imgElement.style.left = 50 + "px";
        this.imgElement.style.width = (-150 + 2.5 * this.animationProgress) + "px";
        this.imgElement.style.display = "block";
      }
    } else {
      this.animationProgress = 0;
      this.animationBusy = false;
      this.animationQueue.splice(0, 1);
      this.runAnimations();
    }
  }

  runAnimationHide(){
    if (this.animationProgress < 100){
      window.setTimeout(this.runAnimationHide.bind(this), 1);
      this.animationProgress = this.animationProgress + 2;
      if (this.animationProgress > 60){
        this.htmlElement.style.left = this.locX + (50/40) * (100 - this.animationProgress) + "px";
        this.htmlElement.style.width = (100 - 2.5 * (100 - this.animationProgress)) + "px";
        this.imgElement.style.display = "none";
      }
      if (this.animationProgress <= 40){
        this.htmlElement.style.left = this.locX + 50 - (50/40) * ((100 - this.animationProgress) - 60) + "px"
        this.htmlElement.style.width = (-150 + 2.5 * (100 - this.animationProgress)) + "px";
        this.imgElement.style.left = 50 + "px";
        this.imgElement.style.width = (-150 + 2.5 * (100 - this.animationProgress)) + "px";
        this.imgElement.style.display = "block";
      }
    } else {
      this.animationProgress = 0;
      this.animationBusy = false;
      this.animationQueue.splice(0, 1);
      this.runAnimations();
    }
  }

  runAnimationWait(){
    if (this.animationProgress < 100){
      window.setTimeout(this.runAnimationWait.bind(this), 1);
      this.animationProgress = this.animationProgress + 2;
    } else {
      this.animationProgress = 0;
      this.animationBusy = false;
      this.animationQueue.splice(0, 1);
      this.runAnimations();
    }
  }

  runAnimationDismantle(){
    if (this.animationProgress < 100){
      window.setTimeout(this.runAnimationDismantle.bind(this), 2);
      this.animationProgress = this.animationProgress + 0.5;
      this.imgElement.style.width = (100 - this.animationProgress) + "px";
      this.imgElement.style.height = (100 - this.animationProgress) + "px";
      this.imgElement.style.left = 50 + "px";
      this.imgElement.style.top = 50 + "px";
      this.htmlElement.style.width = (100 - this.animationProgress) + "px";
      this.htmlElement.style.height = (100 - this.animationProgress) + "px";
      this.htmlElement.style.top = this.locY + 0.5 * this.animationProgress + "px"
      this.htmlElement.style.left = this.locX + 0.5 * this.animationProgress + "px"
    } else {
      this.animationProgress = 0;
      this.animationBusy = false;
      this.animationQueue = []
      this.htmlElement.style.display = "none";
      this.imgElement.style.display = "none";
    }
  }
}

class Grid {
  constructor(cardTypeArray) {
    this.cardTypeArray = cardTypeArray;
    this.numRows = this.defineNumRows();
    this.distributionArray = this.createDistributionArray();
    this.cardArray = this.createCardArray();
    this.cardsToDismantle = this.cardArray.length;
    this.RevealedArray = [];
    //
    this.moves = 0;
    this.timeElapsed = -1;
    this.timer = null;
    this.htmlElementTrackMoves = document.getElementById("trackMoves");
    this.htmlElementTrackTime = document.getElementById("trackTime");
    this.updateScorecard();
  }

  checkRevealMaximum(){
    if (this.RevealedArray.length === 2){
      for (var index = 0; index < 2; index++){
        this.RevealedArray[index].hideImage(true);
      }
      this.RevealedArray = [];
    }
  }

  checkIsEqual(){
    if (this.RevealedArray[0].content.handle === this.RevealedArray[1].content.handle){
      while (this.RevealedArray[0].animationQueue.length < this.RevealedArray[1].animationQueue.length){
        this.RevealedArray[0].queueAnimation("wait");
      }
      while (this.RevealedArray[1].animationQueue.length < this.RevealedArray[0].animationQueue.length){
        this.RevealedArray[1].queueAnimation("wait");
      }
      this.RevealedArray[0].hideHtmlElement(true);
      this.RevealedArray[1].hideHtmlElement(true);
      this.cardsToDismantle = this.cardsToDismantle - 2;
      console.log(this.cardsToDismantle);
      if (this.cardsToDismantle === 0){
        this.playerVictory();
      }
      this.RevealedArray = [];
    }
  }

  playerVictory(){
    clearTimeout(this.timer);
  }

  undoReveal(whichCard){
    if (this.RevealedArray[0] === whichCard){
      this.RevealedArray.splice(0,1);
    } else {
      this.RevealedArray.splice(1,1);
    }
  }

  rememberReveal(whichCard){
    this.checkRevealMaximum();
    this.RevealedArray.push(whichCard);
    if (this.RevealedArray.length === 2){
      this.checkIsEqual();
    }
  }

  defineNumRows(){
    console.log(this.cardTypeArray.length);
    return Math.round(Math.sqrt(2 * this.cardTypeArray.length));
  }

  createCardArray(){
    var tempCardArray = [];
    var rowTrack = 0;
    var colTrack = 0;
    for (var arrayIndex = 0; arrayIndex < this.distributionArray.length; arrayIndex++){
      tempCardArray.push(new Card(60 + 110 * rowTrack, 150 + 110 * colTrack, this.cardTypeArray[this.distributionArray[arrayIndex]]));
      if (rowTrack !== this.numRows){
        rowTrack++;
      } else {
        colTrack++;
        rowTrack = 0;
      }
    }
    return tempCardArray
  }

  createShadowArray(whichLength){
    // Creates an array with a length of equal size to the array that needs to be shuffled and fills it with random reals.
    var tempShadowArray = []
    for (var index = 0; index < (whichLength * 2); index++){
      tempShadowArray.push(Math.random());
    }
    return tempShadowArray;
  }

  createIndexArray(whichLength){
    // Creates an array with a length of double size to the array that needs to be shuffled and fills it with the indexes.
    var tempIndexArray = []
    for (var index = 0; index < whichLength; index++){
      tempIndexArray.push(index);
      tempIndexArray.push(index);
    }
    return tempIndexArray;
  }

  createDistributionArray(){
    var tempIndexArray = this.createIndexArray(this.cardTypeArray.length);
    var tempShadowArray = this.createShadowArray(this.cardTypeArray.length);
    var tempDistributionArray = [];

    while (tempDistributionArray.length !== (2 * this.cardTypeArray.length)){
      var tempReal = 1.00;
      var tempIndex = 0;
      for (var index = 0; index < tempShadowArray.length; index++){
        if (tempShadowArray[index] < tempReal){
          tempReal = tempShadowArray[index];
          tempIndex = index;
        }
      }
      // found lowest element: push to new distribution array
      tempDistributionArray.push(tempIndexArray[tempIndex]);
      // splice this value from the shadow array
      tempShadowArray.splice(tempIndex,1);
      // splice this value from the index array
      tempIndexArray.splice(tempIndex,1);
    }
    return tempDistributionArray;
  }

  updateScorecard(){
    if (this.moves === 1){
      this.htmlElementTrackMoves.textContent = "You have made 1 move.";
    } else {
      this.htmlElementTrackMoves.textContent = "You have made " + this.moves + " moves.";
    }
    if (this.timeElapsed === -1){
      this.htmlElementTrackTime.textContent = "You haven't started this level yet."
    } else if (this.timeElapsed === 1){
      this.htmlElementTrackTime.textContent = "You have spent 1 second on this level."
    } else if (this.timeElapsed <= 60) {
      this.htmlElementTrackTime.textContent = "You have spent " + this.timeElapsed + " seconds on this level."
    } else if (this.timeElapsed > 60 ) {
      var tempInteger = Math.floor(this.timeElapsed/60);
      this.htmlElementTrackTime.textContent = "You have spent " + tempInteger + " minutes and " + (this.timeElapsed - 60 * tempInteger) + " seconds on this level.";
    }
  }

  trackMoves(){
    this.moves = this.moves + 1;
    this.updateScorecard();
  }

  timeTick(){
    this.timeElapsed = this.timeElapsed + 1;
    this.updateScorecard();
    this.timer = window.setTimeout(this.timeTick.bind(this), 1000)
  }
}

class CardType {
  constructor(link, handle) {
    this.link = link;
    this.handle = handle;
  }
}

var globalCardTypeArray = []

globalCardTypeArray.push(new CardType("images/seal.jpg", "seal"));
globalCardTypeArray.push(new CardType("images/cow.jpg", "cow"));
globalCardTypeArray.push(new CardType("images/cat.jpg", "cat"));
globalCardTypeArray.push(new CardType("images/donkey.jpg", "donkey"));
globalCardTypeArray.push(new CardType("images/lajhar.jpg", "lajhar"));
globalCardTypeArray.push(new CardType("images/lelefante.jpg", "elephant"));
globalCardTypeArray.push(new CardType("images/dog.jpg", "dog"));
globalCardTypeArray.push(new CardType("images/piglet.jpg", "piglet"));
globalCardTypeArray.push(new CardType("images/monkey.jpg", "monkey"));
globalCardTypeArray.push(new CardType("images/whale.jpg", "whale"));
globalCardTypeArray.push(new CardType("images/rat.jpg", "rat"));

var htmlGrid = document.getElementById('htmlGrid');
var grid = new Grid(globalCardTypeArray);
