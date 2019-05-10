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
    this.htmlElement.addEventListener("click", this.htmlElementOnClick.bind(this));
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
    htmlGrid.appendChild(tempCard);
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
    grid.trackMoves();
    if (this.isRevealed === false && this.animationIsBusy === false){
      this.showImage();
      grid.rememberReveal(this);
    } else if (this.isRevealed === true && this.animationIsBusy === false) {
      this.hideImage();
      grid.undoReveal(this);
    }
    if (grid.trackTimeTimeElapsed === -1){
      grid.trackTime();
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
    this.htmlElement.classList.add("cardAnimShowHide");
    this.imgElement.classList.add("cardImgAnimShow");
    this.imgElement.style.visibility = "visible";
    window.setTimeout(this.runAnimShowCallback.bind(this), 500);
  }

  runAnimShowCallback(){
    this.htmlElement.classList.remove("cardAnimShowHide");
    this.imgElement.classList.remove("cardImgAnimShow");
    this.cleanupAnimation();
  }

  runAnimHide(){
    this.htmlElement.classList.add("cardAnimShowHide");
    this.imgElement.classList.add("cardImgAnimHide");
    this.imgElement.style.visibility = "hidden";
    window.setTimeout(this.runAnimHideCallback.bind(this), 500);
  }

  runAnimHideCallback(){
    this.htmlElement.classList.remove("cardAnimShowHide");
    this.imgElement.classList.remove("cardImgAnimHide");
    this.cleanupAnimation();
  }

  runAnimWait(){
    window.setTimeout(this.runAnimWaitCallback.bind(this), 500);
  }

  runAnimWaitCallback(){
    this.cleanupAnimation();
  }

  runAnimDestroy(){
    this.htmlElement.classList.add("cardAnimDestroy");
    this.imgElement.classList.add("cardImgAnimDestroy");
    window.setTimeout(this.runAnimDestroyCallback.bind(this), 500);
  }

  runAnimDestroyCallback(){
    this.htmlElement.classList.remove("cardAnimDestroy");
    this.imgElement.classList.remove("cardImgAnimDestroyCallback");
    htmlGrid.removeChild(this.htmlElement);
    this.htmlElement.removeChild(this.imgElement);
    this.htmlElement.remove();
    this.imgElement.remove();
    this.cleanupAnimation();
  }

  runAnimAppear(){
    this.htmlElement.classList.add("cardAnimAppear");
    window.setTimeout(this.runAnimAppearCallback.bind(this), 500);
    this.cleanupAnimation();
  }

  runAnimAppearCallback(){
    this.htmlElement.classList.remove("cardAnimAppear");
    this.cleanupAnimation();
  }
}

class Grid {
  constructor(numImages, numLevel) {
    this.cardTypeArray = this.getCardTypeArray(numImages);
    this.numRows = this.defineNumRows();
    this.distributionArray = this.createDistributionArray();
    this.cardArray = this.createCardArray();
    this.cardsToDismantle = this.cardArray.length;
    this.revealedArray = [];
    this.victoryAnimArray = [];
    // Trackers:
    this.trackMovesNumMoves = 0;
    this.trackTimeTimeElapsed = -1;
    this.trackTimeTimer = null;
    this.trackLevelValue = numLevel;
    this.htmlElementTrackMoves = document.getElementById("trackMoves");
    this.htmlElementTrackTime = document.getElementById("trackTime");
    this.htmlElementTrackLevel = document.getElementById("trackLevel");
    this.updateScorecard();
  }

  // STATIC: Only ever called once by constructor.

  getCardTypeArray(numImages){
    var tempCardArray = [];
    // FAILSAFE: Can't have more cards than I have images for.
    if (numImages > globalCardTypeArray.length){
      numImages = globalCardTypeArray.length;
    }
    // Create an initial array containing all the possible images.
    for (var index = 0; index < globalCardTypeArray.length; index++){
      tempCardArray.push(globalCardTypeArray[index]);
    }
    // Splice an image each iteration until I have numImages many images.
    while (tempCardArray.length !== numImages){
      tempCardArray.splice(Math.floor(Math.random()*tempCardArray.length), 1);
    }
    return tempCardArray;
  }

  defineNumRows(){
    return Math.round(Math.sqrt(2 * this.cardTypeArray.length));
  }

  createCardArray(){
    var tempCardArray = [];
    var rowTrack = 0;
    var colTrack = 0;
    for (var arrayIndex = 0; arrayIndex < this.distributionArray.length; arrayIndex++){
      tempCardArray.push(new Card(60 + 110 * rowTrack, 180 + 110 * colTrack, this.cardTypeArray[this.distributionArray[arrayIndex]]));
      console.log("A")
      console.log(rowTrack);
      console.log(colTrack);
      console.log(this.numRows);
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
      this.cardsToDismantle = this.cardsToDismantle - 2;
      if (this.cardsToDismantle === 0){
        this.victory();
      }
      this.revealedArray = [];
    }
  }

  rememberReveal(whichCard){
    // The player turns up a card. Animation is Card's job.
    // If this is the third card that is being turned up: Forget the previous two:
    this.checkRevealMaximum();
    // Add this card to the array that remembers upturned cards. Check if they are the same.
    this.revealedArray.push(whichCard);
    if (this.revealedArray.length === 2){
      this.checkIsEqual();
    }
  }

  undoReveal(whichCard){
  // The player manually turns down a card. The animation is Card's job.
  // Grid splices the previously revealed card.
    if (this.revealedArray[0] === whichCard){
      this.revealedArray.splice(0, 1);
    } else {
      this.revealedArray.splice(1, 1);
    }
  }

  updateScorecard(){
    // Tracking the level.
    this.htmlElementTrackLevel.textContent = "You are on Level " + this.trackLevelValue + ".";
    // Tracking moves:
    if (this.trackMovesNumMoves === 1){
      this.htmlElementTrackMoves.textContent = "You have made 1 move this level.";
    } else {
      this.htmlElementTrackMoves.textContent = "You have made " + this.trackMovesNumMoves + " moves this level.";
    }
    // Tracking time:
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

    for (var index = 0; index < tempArray.length; index++){
      var tempElement = document.createElement("div");
      htmlGrid.appendChild(tempElement);
      tempElement.style.left = 100 + 50*index + "px";
      tempElement.style.top = 300;
      tempElement.className = "victoryText"
      tempElement.textContent = tempArray[index];
      tempElement.classList.add("victoryTextAnim");
      this.victoryAnimArray.push(tempElement);
    }
    window.setTimeout(this.runAnimVictoryCallback.bind(this), 5000);
  }


  runAnimVictoryCallback(){
    for (var index = 0; index < this.victoryAnimArray.length; index++){
      htmlGrid.removeChild(this.victoryAnimArray[index]);
    }
    this.trackLevelValue = this.trackLevelValue + 1;
    startNextLevel(2 + this.trackLevelValue, this.trackLevelValue);
  }

  trackMoves(){
    this.trackMovesNumMoves++;
    this.updateScorecard();
  }

  trackTime(){
    this.trackTimeTimeElapsed++;
    this.trackTimeTimer = window.setTimeout(this.trackTime.bind(this),1000);
    this.updateScorecard();
  }
}

class CardType {
  constructor(imgSrc, handle) {
    this.imgSrc = imgSrc;
    this.handle = handle;
  }
}

var globalCardTypeArray = [];
var srcArray = ["images/seal.jpg", "images/cow.jpg", "images/cat.jpg", "images/donkey.jpg", "images/lajhar.jpg", "images/lelefante.jpg", "images/dog.jpg", "images/piglet.jpg", "images/monkey.jpg", "images/whale.jpg", "images/rat.jpg"]
for (var index = 0; index < srcArray.length; index++){
  globalCardTypeArray.push(new CardType(srcArray[index], index));
}

var htmlGrid = document.getElementById('htmlGrid');

var grid = null;
function startNextLevel(numCards, whichLevel){
  grid = null;
  grid = new Grid(numCards, whichLevel);
}

startNextLevel(3, 1);
