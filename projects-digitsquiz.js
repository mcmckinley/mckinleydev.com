// easy sudoku
var feedbackBoxes = [];
var userEntryBoxes = [];
for (var i = 0; i < 10; i++) {
  feedbackBoxes.push(document.getElementById("feedback" + i));
  userEntryBoxes.push(document.getElementById("user-entry" + i));
}

//digitsDisplay.innerHTML = sudokuToString(unsolvedSudoku);

var entries = [];

function quiz(responses) {
  // enter responses
  var responseIndex = 4;
  var enterResponse = setInterval(function () {

    // enter digits
    var digitIndex = 0;

    var enterDigit = setInterval(function () {
      digitIndex++;

      // update the text boxes
      for (var i = 0; i < digitIndex; i++) {
        userEntryBoxes[i].innerHTML = responses[responseIndex][i];
      }

      // stop entering digits once all 10 are n
      if (digitIndex == 10) {
        clearInterval(enterDigit);

        // clear the entry boxes
        for (var i = 0; i < 10; i++) {
          userEntryBoxes[i].innerHTML = " ";
        }

        // update the feedback boxes
        for (var i = 0; i < 10; i++) {
          feedbackBoxes[i].innerHTML = responses[responseIndex][i];
          if (responses[responseIndex][i] == responses[0][i]) {
            feedbackBoxes[i].style.color = "green";
          } else {
            feedbackBoxes[i].style.color = "red";
          }
        }
      }
    }, 150);

    responseIndex--;
    if (responseIndex == 0) {
      clearInterval(enterResponse);
    }
  }, 1600);
}

quiz(generateRandomResponses());
for (var i = 0; i < 10; i++) {
  feedbackBoxes[i].innerHTML = " ";
  userEntryBoxes[i].innerHTML = " ";
}

setInterval(function () {
  for (var i = 0; i < 10; i++) {
    feedbackBoxes[i].innerHTML = " ";
    userEntryBoxes[i].innerHTML = " ";
  }
  const responses = generateRandomResponses();
  quiz(responses);
}, 10000);

function initiate() {}

function turn() {}

function createEntryArray() {
  var digits = generateRandomResponses();

}

// Creates a list of responses, starting with the correct one
// and progressively getting more and more incorrect
function generateRandomResponses() {
  // Create a list of 5 random numbers 0-9, that don't repeat.
  var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var wrongIndices = [];
  for (var i = 0; i < 5; i++) {
    const index = Math.floor((9 - i) * Math.random(0, 9 - i));
    wrongIndices.push(nums[index]);
    nums.splice(index, 1);
  }

  // Randomly create the correct answer.
  var correctAns = [];
  for (var i = 0; i < 10; i++) {
    correctAns.push(randomDigit());
  }

  // Add the correct answer to the responses array.
  responses = [correctAns];

  // Add responses that progressively get more incorrect
  for (var i = 0; i < 5; i++) {
    // The new wrong answer starts out as the previous one..
    wrongAnswer = responses[i].slice();
    // and then one digit is randomly changed
    wrongAnswer[wrongIndices[i]] = randomDigit();
    responses.push(wrongAnswer);
  }

  return responses;
}

function randomDigit() {
  return Math.floor(9 * Math.random(0, 9)).toString();
}

createEntryArray();
