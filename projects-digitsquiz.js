// easy sudoku
const digitsDisplay = document.getElementById("digits-display");

//digitsDisplay.innerHTML = sudokuToString(unsolvedSudoku);

var entries = [];


function updateDisplay(responses) {
    //digitsDisplay.innerHTML= responses[0].join("");
    initiate();

    //1. solve the sudoku
    var solve = setInterval(function () {
      turn();
      //digitsDisplay.innerHTML = digitsToString();
      if (solved) {
        clearInterval(solve);
      }
    }, 100);
}

setInterval(function(){
  const responses = generateRandomResponses();
  updateDisplay(responses);
}, 6500)

function initiate(){
    
}

function turn() {
  
}

function createEntryArray(){
  var digits = generateRandomResponses();

  console.log(digits);
}

// Creates a list of responses, starting with the correct one
// and progressively getting more and more incorrect
function generateRandomResponses(){
  // Create a list of 5 random numbers 0-9, that don't repeat.
  var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  var wrongIndices = [];
  for (var i=0; i<5; i++){
    const index = Math.floor((9-i)*Math.random(0, 9-i)); 
    wrongIndices.push(nums[index]);
    nums.splice(index, 1)
  }

  // Randomly create the correct answer.
  var correctAns = [];
  for (var i=0; i<10; i++){
    correctAns.push(randomDigit());
  }
  
  // Add the correct answer to the responses array.
  responses = [correctAns];

  
  // Add responses that progressively get more incorrect
  for (var i=0; i<5; i++){
    // The new wrong answer starts out as the previous one..
    wrongAnswer = responses[i].slice();
    // and then one digit is randomly changed
    wrongAnswer[wrongIndices[i]] = randomDigit();
    responses.push(wrongAnswer)
  }
  
  return responses;
}



function randomDigit(){
  return Math.floor(9*Math.random(0, 9)).toString();
}

createEntryArray();