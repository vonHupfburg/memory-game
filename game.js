class Card{
  constructor(locX, locY, content){
    this.locX = locX;
    this.locY = locY;
    this.content = content
    this.htmlElement = this.createCard();
    this.imgElement = this.addImage();
    this.isRevealed = false;
    this.animationQueue = [];
    this.animationIsBusy = false;
    this.realignCard();
    this.queueAnimation("appear");
  }

  addImage(cardType){
    var tempContent = document.createElement("img")
    this.htmlElement.appendChild(tempContent);
    tempContent.src = this.content.imgSrc;
    tempContent.style.visibility = "hidden";
    return tempContent
  }

  createCard(){
    var tempCard = document.createElement("div");
    tempCard.className = "card";
    memoryGame.htmlGrid.appendChild(tempCard);
    tempCard.addEventListener("click", this.htmlElementOnClick.bind(this));
    return tempCard;
  }

  destroyCard(){
    this.isClickable = false;
    this.queueAnimation("destroy")
  }

  realignCard(){
    this.htmlElement.style.left = this.locX + "px";
    this.htmlElement.style.top = this.locY + "px";
  }

  htmlElementOnClick(){
    memoryGame.trackMoves();
    if (this.isRevealed === false && this.animationIsBusy === false){
      this.showImage();
      memoryGame.grid.addToRevealedArray(this);
    } else if (this.isRevealed === true && this.animationIsBusy === false) {
      memoryGame.grid.nullRevealedArray();
    }
    if (memoryGame.trackTimeTimeElapsed === -1){
      memoryGame.trackTime();
    }
  }

  showImage(){
    this.isRevealed = true;
    this.queueAnimation("show");
  }

  hideImage(){
    this.isRevealed = false;
    this.queueAnimation("hide");
  }

  queueAnimation(whichAnimation){
    this.animationQueue.push(whichAnimation);
    this.runAnimations();
  }

  runAnimations(){
    if (this.animationIsBusy === false && this.animationQueue.length !== 0){
      this.runNextAnimation();
    }
  }

  runNextAnimation(){
    this.animationIsBusy = true;
    if (this.animationQueue[0] === "show"){
      this.runAnimShow();
    }
    if (this.animationQueue[0] === "hide"){
      this.runAnimHide();
    }
    if (this.animationQueue[0] === "wait"){
      this.runAnimWait();
    }
    if (this.animationQueue[0] === "destroy"){
      this.runAnimDestroy();
    }
    if (this.animationQueue[0] === "appear"){
      this.runAnimAppear();
    }
  }

  cleanupAnimation(){
    this.animationIsBusy = false;
    this.animationQueue.splice(0, 1);
    this.runAnimations();
  }

  runAnimShow(){
    this.htmlElement.classList.add("card-anim-show-hide");
    this.imgElement.classList.add("card-img-anim-show");
    this.imgElement.style.visibility = "visible";
    window.setTimeout(this.runAnimShowCallback.bind(this), 500);
  }

  runAnimShowCallback(){
    this.htmlElement.classList.remove("card-anim-show-hide");
    this.imgElement.classList.remove("card-img-anim-show");
    this.cleanupAnimation();
  }

  runAnimHide(){
    this.htmlElement.classList.add("card-anim-show-hide");
    this.imgElement.classList.add("card-img-anim-hide");
    this.imgElement.style.visibility = "hidden";
    window.setTimeout(this.runAnimHideCallback.bind(this), 500);
  }

  runAnimHideCallback(){
    this.htmlElement.classList.remove("card-anim-show-hide");
    this.imgElement.classList.remove("card-img-anim-hide");
    this.cleanupAnimation();
  }

  runAnimWait(){
    window.setTimeout(this.runAnimWaitCallback.bind(this), 500);
  }

  runAnimWaitCallback(){
    this.cleanupAnimation();
  }

  runAnimDestroy(){
    this.htmlElement.classList.add("card-anim-destroy");
    this.imgElement.classList.add("card-img-anim-destroy");
    window.setTimeout(this.runAnimDestroyCallback.bind(this), 500);
  }

  runAnimDestroyCallback(){
    this.htmlElement.classList.remove("card-anim-destroy");
    this.imgElement.classList.remove("card-img-anim-destroy");
    memoryGame.htmlGrid.removeChild(this.htmlElement);
    this.htmlElement.removeChild(this.imgElement);
    this.htmlElement.remove();
    this.imgElement.remove();
    this.cleanupAnimation();
  }

  runAnimAppear(){
    this.htmlElement.classList.add("card-anim-appear");
    window.setTimeout(this.runAnimAppearCallback.bind(this), 500);
    this.cleanupAnimation();
  }

  runAnimAppearCallback(){
    this.htmlElement.classList.remove("card-anim-appear");
    this.cleanupAnimation();
  }
}

class Grid {
  constructor(cardTypeArray) {
    this.cardTypeArray = cardTypeArray;
    this.numRows = this.defineNumRows();

    this.distributionArray = this.createDistributionArray();

    //
    this.drawStartX = 60;
    this.drawStartY = 180;
    this.drawWidth = 100;
    this.drawDistance = 10;

    this.cardArray = this.createCardArray();
    this.revealedArray = [];
  }

  defineNumRows(){
    return Math.round(Math.sqrt(2 * this.cardTypeArray.length));
  }

  getWidth(){
    return "100px"
  }

  createCardArray(){
    var tempCardArray = [];
    var rowTrack = 0;
    var colTrack = 0;
    for (var arrayIndex = 0; arrayIndex < this.distributionArray.length; arrayIndex++){
      tempCardArray.push(new Card(this.drawStartX + (this.drawDistance + this.drawWidth) * rowTrack, this.drawStartY + (this.drawDistance + this.drawWidth) * colTrack, memoryGame.cardTypeArray[this.distributionArray[arrayIndex]]));
      if (rowTrack !== (this.numRows - 1)){
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

  createDistributionArray(cardTypeArray){
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

  // DYNAMIC: Multiple uses.

  checkRevealMaximum(){
    if (this.revealedArray.length === 2){
      for (var index = 0; index < 2; index++){
        this.revealedArray[index].hideImage(true);
      }
      this.revealedArray = [];
    }
  }

  checkIsEqual(){
    if (this.revealedArray[0].content.handle === this.revealedArray[1].content.handle){
      // This part makes sure cards don't disappear before their respective counterpart can finish their show animation
      // by adding as many waits as the other card still has in its animationQueue.
      while (this.revealedArray[0].animationQueue.length < this.revealedArray[1].animationQueue.length){
        this.revealedArray[0].queueAnimation("wait");
      }
      while (this.revealedArray[1].animationQueue.length < this.revealedArray[0].animationQueue.length){
        this.revealedArray[1].queueAnimation("wait");
      }
      // These cards are removed.
      this.revealedArray[0].destroyCard(true);
      this.revealedArray[1].destroyCard(true);
      // Victory: cardToDismantle reaches 0.
      memoryGame.numCardsToDismantle = memoryGame.numCardsToDismantle - 2;
      if (memoryGame.numCardsToDismantle === 0){
        memoryGame.victory();
      }
      this.revealedArray = [];
    }
  }

  addToRevealedArray(whichCard){
    this.checkRevealMaximum();
    this.revealedArray.push(whichCard);
    if (this.revealedArray.length === 2){
      this.checkIsEqual();
    }
  }

  nullRevealedArray(){
    for (var index = 0; index < this.revealedArray.length; index++){
      this.revealedArray[index].hideImage();
    }
    this.revealedArray = [];
  }
}

class CardType {
  constructor(imgSrc, handle) {
    this.imgSrc = imgSrc;
    this.handle = handle;
  }
}

class MemoryGame {
  constructor() {
    this.srcArray = this.createSrcArray();
    this.cardTypeArray = this.createCardTypeArray();
    this.htmlGrid = document.getElementById('htmlGrid');
    this.htmlElementVictoryAnim = document.getElementById("victoryAnim");
    this.htmlElementTrackMoves = document.getElementById("trackMoves");
    this.htmlElementTrackTime = document.getElementById("trackTime");
    this.htmlElementTrackLevel = document.getElementById("trackLevel");

    this.numCardsToDismantle = 0;
    this.trackMovesNumMoves = 0;
    this.trackTimeTimeElapsed = -1;
    this.trackTimeTimer = null;
    this.trackLevelValue = 1;
    this.victoryAnimArray = [];

    this.startGame();
  }

  // This is needed, otherwise memoryGame return undefined when grid first tries to call it:
  startGame(){
    window.setTimeout(this.startGameCallback.bind(this), 1);
  }

  startGameCallback(){
    this.grid = this.startNextLevel(3)
  }

  startNextLevel(numCards){
    this.trackMovesNumMoves = 0;
    this.trackTimeTimeElapsed = -1;
    this.updateScorecardTime();
    this.updateScorecardMoves();
    var tempGrid = new Grid(this.getLevelCardTypeArray(numCards));
    this.numCardsToDismantle = 2 * numCards;
    return tempGrid;
  }

  getLevelCardTypeArray(numImages){
    var tempCardArray = [];
    if (numImages > this.cardTypeArray.length){
      numImages = this.cardTypeArray.length;
    }
    for (var index = 0; index < this.cardTypeArray.length; index++){
      tempCardArray.push(this.cardTypeArray[index]);
    }
    while (tempCardArray.length !== numImages){
      tempCardArray.splice(Math.floor(Math.random()*tempCardArray.length), 1);
    }
    return tempCardArray;
  }

  createSrcArray(){
    var tempArray = [
      "images/im1.jpg",
      "images/im2.jpg",
      "images/im3.jpg",
      "images/im4.jpg",
      "images/im5.jpg",
      "images/im6.jpg",
      "images/im7.jpg",
      "images/im8.jpg",
      "images/im9.jpg",
      "images/im10.jpg",
      "images/im11.jpg",
      "images/im12.jpg",
      "images/im13.jpg",
      "images/im14.jpg",
      "images/im15.jpg",
      "images/im16.jpg",
      "images/im17.jpg",
      "images/im18.jpg",
    ];
    return tempArray;
  }

  createCardTypeArray(){
    var tempArray = []
    for (var index = 0; index < this.srcArray.length; index++){
      tempArray.push(new CardType(this.srcArray[index], index));
    }
    return tempArray;
  }

  victory(){
    window.clearTimeout(this.trackTimeTimer);
    this.runAnimVictory();
  }

  runAnimVictory(){
    var tempInteger = Math.floor(Math.random()*3);
    if (tempInteger === 1){
      var tempArray = ["V", "I", "C", "T", "O", "R", "Y", "!"];
    } else if (tempInteger === 2) {
      var tempArray = ["W", "E", "L", "L", " ", "D", "O", "N", "E", "!"];
    } else {
      var tempArray = ["C", "O", "N", "G", "R", "A", "T", "U", "L", "A", "T", "I", "O", "N", "S", "!"];
    }
    this.victoryAnimArray = [];
    for (var index = 0; index < tempArray.length; index++){
      var tempElement = document.createElement("div");
      this.htmlElementVictoryAnim.appendChild(tempElement);
      tempElement.style.left = 50 + 40 * index + "px";
      tempElement.style.top = 300;
      tempElement.className = "victory-text"
      tempElement.textContent = tempArray[index];
      tempElement.classList.add("victory-text-anim");
      this.victoryAnimArray.push(tempElement);
    }
    window.setTimeout(this.runAnimVictoryCallback.bind(this), 5000);
  }

  runAnimVictoryCallback(){
    for (var index = 0; index < this.victoryAnimArray.length; index++){
      this.htmlElementVictoryAnim.removeChild(this.victoryAnimArray[index]);
    }

    this.trackLevelValue = this.trackLevelValue + 1;
    this.updateScorecardLevel();
    this.grid = this.startNextLevel(2 + this.trackLevelValue);
  }

  trackMoves(){
    this.trackMovesNumMoves++;
    this.updateScorecardMoves();
  }

  trackTime(){
    this.trackTimeTimeElapsed++;
    this.trackTimeTimer = window.setTimeout(this.trackTime.bind(this),1000);
    this.updateScorecardTime();
  }

  updateScorecardLevel(){
    this.htmlElementTrackLevel.textContent = "You are on Level " + this.trackLevelValue + ".";
  }

  updateScorecardMoves(){
    if (this.trackMovesNumMoves === 1){
      this.htmlElementTrackMoves.textContent = "You have made 1 move this level.";
    } else {
      this.htmlElementTrackMoves.textContent = "You have made " + this.trackMovesNumMoves + " moves this level.";
    }
  }

  updateScorecardTime(){
    if (this.trackTimeTimeElapsed === -1){
      this.htmlElementTrackTime.textContent = "You haven't started this level yet."
    } else if (this.trackTimeTimeElapsed === 1){
      this.htmlElementTrackTime.textContent = "You have spent 1 second on this level."
    } else if (this.trackTimeTimeElapsed <= 60) {
      this.htmlElementTrackTime.textContent = "You have spent " + this.trackTimeTimeElapsed + " seconds on this level."
    } else if (this.trackTimeTimeElapsed > 60 ) {
      var tempInteger = Math.floor(this.trackTimeTimeElapsed/60);
      this.htmlElementTrackTime.textContent = "You have spent " + tempInteger + " minutes and " + (this.trackTimeTimeElapsed - 60 * tempInteger) + " seconds on this level.";
    }
  }
}

var memoryGame = new MemoryGame();
