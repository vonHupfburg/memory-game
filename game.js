class Card{
  constructor(locX, locY, content){
    // PROPS
    this.locX = locX;
    this.locY = locY;
    this.content = content
    this.htmlElement = this.createCard();
    this.imgElement = this.addImage();
    this.isRevealed = false;
    this.isClickable = true;
    // Init card
    this.hideImage(false);
    this.realignCard();
    // Clickable
    this.htmlElement.addEventListener("click", this.htmlElementOnClick.bind(this));
    // CANDY
    this.animationQueue = [];
    this.animationBusy = false;
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
    tempContent.src = this.content.imgSrc;
    return tempContent
  }

  htmlElementOnClick(){
    grid.trackMoves();
    if (this.isRevealed === false && this.isClickable === true && this.animationBusy === false){
      this.showImage(true);
      grid.rememberReveal(this);
    } else if (this.isRevealed === true && this.isClickable === true && this.animationBusy === false) {
      this.hideImage(true);
      grid.undoReveal(this);
    }
    if (grid.timeElapsed === -1){
      grid.timeTick();
    }
  }

  showImage(wantAnimation){
    this.isRevealed = true;
    if (wantAnimation === true){
      this.queueAnimation("show");
    } else {
      this.imgElement.style.visibility = "visible";
    }
  }

  hideImage(wantAnimation){
    this.isRevealed = false;
    if (wantAnimation === true){
      this.queueAnimation("hide");
    } else {
      this.imgElement.style.visibility = "hidden";
    }
  }

  dismantleHtmlElement(wantAnimation){
    this.isClickable = false;
    if (wantAnimation === true){
      this.queueAnimation("dismantle")
    } else {
      this.htmlElement.style.visibility = "hidden";
    }
  }

  queueAnimation(whichAnimation){
    this.animationQueue.push(whichAnimation);
    this.runAnimations();
  }

  runAnimations(){
    if (this.animationBusy === false && this.animationQueue.length !== 0){
      this.runNextAnimation();
    }
  }

  runNextAnimation(){
    this.animationBusy = true;
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

  cleanupAnimation(){
    this.animationBusy = false;
    this.animationQueue.splice(0, 1);
    this.runAnimations();
  }

  runAnimationShow(){
    this.htmlElement.classList.add("cardAnimShowHide");
    this.imgElement.classList.add("cardImgAnimShow");
    this.imgElement.style.visibility = "visible"
    window.setTimeout(this.runAnimationShowCallback.bind(this), 1000);
  }

  runAnimationShowCallback(){
    this.htmlElement.classList.remove("cardAnimShowHide");
    this.imgElement.classList.remove("cardImgAnimShow");
    this.cleanupAnimation();
  }

  runAnimationHide(){
    this.htmlElement.classList.add("cardAnimShowHide");
    this.imgElement.classList.add("cardImgAnimHide");
    this.imgElement.style.visibility = "hidden";
    window.setTimeout(this.runAnimationHideCallback.bind(this), 1000);
  }

  runAnimationHideCallback(){
    this.htmlElement.classList.remove("cardAnimShowHide");
    this.imgElement.classList.remove("cardImgAnimHide");
    this.cleanupAnimation();
  }

  runAnimationWait(){
    window.setTimeout(this.runAnimationWaitCallback.bind(this), 1000);
  }

  runAnimationWaitCallback(){
    this.cleanupAnimation();
  }

  runAnimationDismantle(){
    this.htmlElement.classList.add("cardAnimDismantle");
    this.imgElement.classList.add("cardImgAnimDismantle");
    window.setTimeout(this.runAnimationDismantleCallback.bind(this), 1000);
  }

  runAnimationDismantleCallback(){
    this.htmlElement.classList.remove("cardAnimDismantle");
    this.imgElement.classList.remove("cardImgAnimDismantleCallback");
    this.imgElement.style.visibility = "hidden";
    this.htmlElement.style.visibility = "hidden";
    this.cleanupAnimation();
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
      // TODO: Peg animation timer. Wait must know how long to wait otherwise it adds the delay on user clicks.
      console.log(this.RevealedArray[0].animationQueue);
      console.log(this.RevealedArray[1].animationQueue);
      while (this.RevealedArray[0].animationQueue.length < this.RevealedArray[1].animationQueue.length){
        this.RevealedArray[0].queueAnimation("wait");
      }
      while (this.RevealedArray[1].animationQueue.length < this.RevealedArray[0].animationQueue.length){
        this.RevealedArray[1].queueAnimation("wait");
      }
      this.RevealedArray[0].dismantleHtmlElement(true);
      this.RevealedArray[1].dismantleHtmlElement(true);
      this.cardsToDismantle = this.cardsToDismantle - 2;
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
var grid = new Grid(globalCardTypeArray);
