class Card{
  constructor(locX, locY, content){
    this.locX = locX;
    this.locY = locY;
    this.content = content
    this.htmlElement = this.createCard();
    this.imgElement = this.addImage();
    //this.hideImage(false);
    this.realignCard();
    //console.log(this.imgElement);
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

  hideImage(wantAnimation){
    this.imgElement.style.display = "none";
  }
}

class Grid {
  constructor(cardTypeArray) {
    this.cardTypeArray = cardTypeArray;
    this.numRows = this.defineNumRows();
    this.distributionArray = this.createDistributionArray();
    this.cardArray = this.createCardArray();
  }

  defineNumRows(){
    return Math.round(Math.sqrt(2 * this.cardTypeArray.length));
  }

  createCardArray(){
    var tempCardArray = [];
    var rowTrack = 0;
    var colTrack = 0;
    for (var arrayIndex = 0; arrayIndex < this.distributionArray.length; arrayIndex++){
      tempCardArray.push(new Card(60 + 110 * rowTrack, 100 + 110 * colTrack, this.cardTypeArray[this.distributionArray[arrayIndex]]));
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

var htmlGrid = document.getElementById('htmlGrid');
var grid = new Grid(globalCardTypeArray);
