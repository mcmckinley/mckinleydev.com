// digits.js

// Animates the main screen visible at mckinleydev.digits.com

// Interval variables keep the IDs of the timers that constantly run.
// These are used to cancel the timers when the page is hidden.
var quizInterval = undefined;
var responseInterval = undefined;
var digitInterval = undefined;

// Milliseconds between each digit entry and response
const typeSpeed = 100; 
const timeBetweenResponses = 200; 

 // HTML text elements
var feedbackBoxes = [];
var userEntryBoxes = [];
for (var i = 0; i < 10; i++) {
  feedbackBoxes.push(document.getElementById("feedback" + i));
  userEntryBoxes.push(document.getElementById("user-entry" + i));
}

//Initializes the program
var responses = generateRandomResponses();
quiz(responses);
quizInterval = setInterval(function () {
  for (var i = 0; i < 10; i++) {
    feedbackBoxes[i].innerHTML = "_";
    feedbackBoxes[i].style.color = "#444"
    userEntryBoxes[i].innerHTML = "_";
  }
  responses = generateRandomResponses();
  quiz(responses);
}, 10000);

// Manages the program state
// Starts it when the page opens.
// Cancels it when the user leaves
document.addEventListener('visibilitychange', function() {
  resetAllBoxes();
  if (document.hidden) {
    clearInterval(digitInterval);
    clearInterval(responseInterval);
    clearInterval(quizInterval);
    responses = undefined;
  } else {
    responses = generateRandomResponses();
    quiz(responses);
    quizInterval = setInterval(function () {
      responses = generateRandomResponses();
      quiz(responses);
    }, 10000);
  }
});

// Runs a "quiz": four wrong responses and a right one
function quiz(responses) {
  var responseIndex = 4;
  responseInterval = setInterval(function () {
    clearUserEntryBoxes();

    // One by one, update the text boxes
    var digitIndex = 0;
    digitInterval = setInterval(function () {
      userEntryBoxes[digitIndex].innerHTML = responses[responseIndex][digitIndex];
      digitIndex++;
      // once the digits have been entered
      if (digitIndex == 10){ 
        clearInterval(digitInterval)
        updateFeedbackBoxes(responses[responseIndex], responses[0]);
        responseIndex--;
      }
    }, typeSpeed)

    if (responseIndex == 0) {
      clearInterval(responseInterval);
    }
  }, typeSpeed * 10 + timeBetweenResponses);
}

function clearUserEntryBoxes(){
  for (var i=0; i<10; i++){
    userEntryBoxes[i].innerHTML = "_";
  }
}

function resetAllBoxes(){
  for (var i = 0; i < 10; i++) {
    feedbackBoxes[i].innerHTML = "_";
    feedbackBoxes[i].style.color = "#444"
    userEntryBoxes[i].innerHTML = "_";
  }
}

function updateFeedbackBoxes(entry, correctAnswer){
  for (var i = 0; i < 10; i++) {
    feedbackBoxes[i].innerHTML = entry[i];
    if (entry[i] == correctAnswer[i]) {
      feedbackBoxes[i].style.color = "rgb(5, 74, 4)";
    } else {
      feedbackBoxes[i].style.color = "rgb(117, 1, 1)";
    }
  }
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
    wrongAnswer[wrongIndices[i]] = randomDigitExcept(correctAns[wrongIndices[i]]);
    responses.push(wrongAnswer);
  }

  return responses;
}

// Give a random digit that isn't avoidThisDigit
function randomDigitExcept(avoidThisDigit) {
  const digit = randomDigit();
  if (digit == avoidThisDigit){
    return randomDigitExcept(avoidThisDigit)
  }
  return digit;
}

function randomDigit(){
  return Math.floor(9 * Math.random(0, 9)).toString();
}

