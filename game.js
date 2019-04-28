class Card{
  constructor(locX, locY){
    this.locX = locX;
    this.locY = locY;
    this.htmlElement = this.createCard();
    this.realignCard();
  };

  createCard(){
    var tempTile = document.createElement("div");
    tempTile.className = "tile";
    htmlGrid.appendChild(tempTile);
    return tempTile;
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
    this.tileMatrix = this.createTileMatrix();
    console.log(this.tileMatrix);
    console.log(this.tileMatrix[3][4]);
    this.tileMatrix[1][1].hideTile();
  }

  createTileMatrix(){
    var tempTileMatrix = [];
    for(var indexRows = 0; indexRows < this.numRows; indexRows++){
      var tempColArray = [];
      for(var indexColumns = 0; indexColumns < this.numCols; indexColumns++){
        tempColArray.push(new Card(60 + 60 * indexRows, 100 + 60 * indexColumns));
      }
      tempTileMatrix.push(tempColArray);
    }
    return tempTileMatrix;
  } // end CreateTileMatrix

}

var htmlGrid = document.getElementById('htmlGrid');
var grid = new Grid(4, 7);
