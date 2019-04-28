class Card{
  constructor(locX, locY){
    this.locX = locX;
    this.locY = locY;
    this.htmlElement = this.createCard();
    this.realignCard();
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

  takeContent(srcLink){
    var tempContent = document.createElement("img")
    this.htmlElement.appendChild(tempContent);
    tempContent.src = srcLink;
  }
}

class Grid {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.cardMatrix = this.createTileMatrix();
    console.log(this.cardMatrix);
    console.log(this.cardMatrix[3][4]);

  }

  createTileMatrix(){
    var tempCardMatrix = [];
    for(var indexRows = 0; indexRows < this.numRows; indexRows++){
      var tempColArray = [];
      for(var indexColumns = 0; indexColumns < this.numCols; indexColumns++){
        tempColArray.push(new Card(60 + 60 * indexRows, 100 + 60 * indexColumns));
      }
      tempCardMatrix.push(tempColArray);
    }
    return tempCardMatrix;
  } // end CreateTileMatrix


}

class CardType {
  constructor(link) {
    this.link = link;
  }
}

var htmlGrid = document.getElementById('htmlGrid');
var grid = new Grid(4, 5);

var cardTypeArray = []
cardTypeArray.push(new CardType("images/seal.jpg"));
cardTypeArray.push(new CardType("images/cow.jpg"));

grid.cardMatrix[3][4].takeContent("images/seal.jpg");
