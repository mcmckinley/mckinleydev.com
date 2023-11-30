// easy sudoku
const sudokuDisplay = document.getElementById("sudoku-display");
const unsolvedSudokuDisplay = document.getElementById("unsolved-sudoku-display");

const unsolvedSudoku =  [5, 0, 1,  6, 7, 0,  9, 0, 0, 
            0, 4, 0,  8, 0, 0,  0, 0, 0,
            8, 0, 0,  5, 0, 0,  6, 1, 3,

            0, 6, 2,  4, 0, 0,  0, 7, 0,
            1, 0, 0,  0, 0, 3,  0, 2, 0, 
            3, 7, 4,  9, 0, 8,  0, 0, 0,

            0, 9, 6,  1, 0, 7,  8, 0, 2, 
            2, 1, 8,  0, 0, 6,  0, 4, 5,
            0, 5, 0,  0, 8, 0,  0, 9, 0];


var sudoku =   [5, 0, 1,  6, 7, 0,  9, 0, 0, 
                0, 4, 0,  8, 0, 0,  0, 0, 0,
                8, 0, 0,  5, 0, 0,  6, 1, 3,

                0, 6, 2,  4, 0, 0,  0, 7, 0,
                1, 0, 0,  0, 0, 3,  0, 2, 0, 
                3, 7, 4,  9, 0, 8,  0, 0, 0,

                0, 9, 6,  1, 0, 7,  8, 0, 2, 
                2, 1, 8,  0, 0, 6,  0, 4, 5,
                0, 5, 0,  0, 8, 0,  0, 9, 0];

unsolvedSudokuDisplay.innerHTML = sudokuToString(unsolvedSudoku);


var givens = [];
for (var i=0; i<81; i++){
    if (sudoku[i] != 0){
        givens.push("given");
    } else {
        givens.push("unknown");
    }
}   

function loop() {
    sudoku = unsolvedSudoku.slice();
    sudokuDisplay.innerHTML= sudokuToString(sudoku);
    initiate();

    //1. solve the sudoku
    var solve = setInterval(function () {
      turn();
      sudokuDisplay.innerHTML= sudokuToString(sudoku);
      if (solved) {
        clearInterval(solve);
      }
    }, 50);
}

setInterval(function(){
    loop();
}, 6500)

function initiate(){
    solved=false;
    currentCell = -1;
    relevantCells = returnAllRelevantCells(currentCell,findRowID(currentCell),findClmID(currentCell),findBoxID(currentCell));
    findNextCell();
}

var solved = false;
var currentCell = -1;
var relevantCells = returnAllRelevantCells(currentCell,findRowID(currentCell),findClmID(currentCell),findBoxID(currentCell));

function turn() {
    // identify all cells in the same row/clm/box as our target cell
    relevantCells = returnAllRelevantCells(
      currentCell,
      findRowID(currentCell),
      findClmID(currentCell),
      findBoxID(currentCell),
    ); 
  
    // increase value of cell until it creates no contradiction
    sudoku[currentCell]++;
    while (contradicts(sudoku[currentCell])) {
      sudoku[currentCell]++;
    } 
  
    //once it's valid, move on to the next cell
    if (sudoku[currentCell] < 10) {
      findNextCell();
      if (currentCell == 81) {
        solved = true;
      }
    } else {
      // if no valid solution exists, clear the cell and backtrack
      sudoku[currentCell] = 0;
      findPreviousCell();
    }
}
  
  // FUNCTIONS
  // find the next cell
function findNextCell() {
    currentCell++;
    while (givens[currentCell] == "given") {
      currentCell++;
    }
}
function findPreviousCell() {
    currentCell--;
    while (givens[currentCell] == "given") {
      currentCell--;
    }
}
  
// returns the all cell IDs of a given row, column or box.
// cell - the cell to check
// row, clm. box - the IDs of the structures of the cell to check
function returnAllRelevantCells(cell, row, clm, box) {
    var cellList = [];
    for (var L = 0; L < 81; L++) {
      if (
        (findRowID(L) == row || findClmID(L) == clm || findBoxID(L) == box) &&
        L != cell
      ) {
        cellList.push(L);
      }
    }
    return cellList;
}
  // this guarantees 81 iterations. we can decrease this. we
  // should check as it goes.
  
  // determine if the value contradicts
function contradicts(currentCellValue) {
    for (var k = 0; k < 24; k++) {
      if (currentCellValue == sudoku[relevantCells[k]]) {
        return true;
      }
    }
    return false;
}
  
  // INSTEA OF USING "CONTRADCITS", JUST SEARCH THE FIRST TIME
  // WHEN YOU RETURN ALL RELEVANT CELLS
  
  // return ID of the structure in which a given cell resides
  function findRowID(cell) {
    return Math.floor(cell / 9);
  }
  function findClmID(cell) {
    return cell % 9;
  }
  
  function findBoxID(cell) {
    // i found a better way to do this, which I implemented in my c++
    // version. too lazy to put it here.
    var column = findClmID(cell);
    var row = findRowID(cell);
    if (column < 3 && row < 3) {
      return 0;
    } else if (column < 6 && row < 3) {
      return 1;
    } else if (row < 3) {
      return 2;
    } else if (column < 3 && row < 6) {
      return 3;
    } else if (column < 6 && row < 6) {
      return 4;
    } else if (row < 6) {
      return 5;
    } else if (column < 3) {
      return 6;
    } else if (column < 6) {
      return 7;
    } else {
      return 8;
    }
  }
  
  // display a sudoku list in 8x8 format
  function sudokuToString(list) {
    var string = "";
    for (var h = 0; h < 9; h++) {
      for (var i = 0; i < 9; i++) {
        // don't show if letter is 0
        if (list[i + h * 9] == 0){
            string += " ";
        } else {
            string+=list[i + h * 9];
        }
        // blank spaces for columns
        if ((i+1)%3==0){
            string+=" ";
        }
      }
      // blank spaces for rows
      string+="\n";
      if ((h+1)%3==0){
        string+="\n";
      }
    }
    return string;
  }
  
  