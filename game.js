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

var htmlGrid = document.getElementById('htmlGrid');
var grid = new Grid(4, 7);

var test = null;
