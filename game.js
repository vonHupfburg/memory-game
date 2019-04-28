class Tile{
  constructor(locX, locY){
    this.locX = locX;
    this.locY = locY;
    this.tileObject = this.createTile();
    this.realignTile();
  };

  createTile(){
    var tempTile = document.createElement("div");
    tempTile.className = "tile";
    htmlGrid.appendChild(tempTile);
    return tempTile;
  }

  realignTile(){
    this.tileObject.style.left = this.locX + "px";
    this.tileObject.style.top = this.locY + "px";
  }

};

class Grid {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.tileMatrix = this.createTileMatrix();
    console.log(this.tileMatrix);
    console.log(this.tileMatrix[3][4]);
  }

  createTileMatrix(){
    var tempTileMatrix = [];
    for(var indexRows = 0; indexRows < this.numRows; indexRows++){
      var tempColArray = [];
      for(var indexColumns = 0; indexColumns < this.numCols; indexColumns++){
        tempColArray.push(new Tile(60 + 60 * indexRows, 100 + 60 * indexColumns));
      }
      tempTileMatrix.push(tempColArray);
    }
    return tempTileMatrix;
  } // end CreateTileMatrix

}

var htmlGrid = document.getElementById('htmlGrid');
var grid = new Grid(4, 7);
