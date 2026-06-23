
var hangmanImage = document.getElementById("hangmanImage");
var hintDisplay = document.getElementById("hintDisplay");
var wordDisplay = document.getElementById("wordDisplay");
var guessForm = document.getElementById("guessForm");
var letterInput = document.getElementById("letterInput");
var guessButton = document.getElementById("guessButton");
var inputError = document.getElementById("inputError");
var incorrectGuessDisplay =
    document.getElementById("incorrectGuessDisplay");
var guessedLettersDisplay =
    document.getElementById("guessedLettersDisplay");
var resultArea = document.getElementById("resultArea");
var resultHeading = document.getElementById("resultHeading");
var resultMessage = document.getElementById("resultMessage");
var playAgainButton = document.getElementById("playAgainButton");



var hangmanGame = {
    wordCollection: [],
    selectedWord: "",
    selectedHint: "",
    guessedLetters: [],
    incorrectGuesses: 0,
    maximumIncorrectGuesses: 6,
    gameIsOver: false
};



function startGame() {
    hangmanGame.guessedLetters = [];
    hangmanGame.incorrectGuesses = 0;
    hangmanGame.gameIsOver = false;

    selectRandomWord();

    hintDisplay.textContent = hangmanGame.selectedHint;
    incorrectGuessDisplay.textContent = "0";
    guessedLettersDisplay.textContent = "None";

    hangmanImage.src = "images/hangman-0.png";
    hangmanImage.alt = "Empty hangman drawing";

    letterInput.value = "";
    letterInput.disabled = false;
    guessButton.disabled = false;

    inputError.textContent = "";
    resultHeading.textContent = "";
    resultMessage.textContent = "";

    resultArea.classList.remove("showResult");
    resultArea.classList.remove("win");
    resultArea.classList.remove("loss");

    playAgainButton.hidden = true;

    updateWordDisplay();

    letterInput.focus();
}



function selectRandomWord() {
    var randomNumber =
        Math.floor(
            Math.random() *
            hangmanGame.wordCollection.length
        );

    var selectedItem =
        hangmanGame.wordCollection[randomNumber];

    hangmanGame.selectedWord =
        selectedItem.word.toLowerCase();

    hangmanGame.selectedHint =
        selectedItem.hint;
}



function processGuess(guessedLetter) {
    var letterWasAlreadyGuessed = false;
    var letterIsInWord = false;
    var i;

    if (hangmanGame.gameIsOver === true) {
        return;
    }

    for (
        i = 0;
        i < hangmanGame.guessedLetters.length;
        i++
    ) {
        if (
            hangmanGame.guessedLetters[i] ===
            guessedLetter
        ) {
            letterWasAlreadyGuessed = true;
        }
    }

    if (letterWasAlreadyGuessed === true) {
        inputError.textContent =
            "You already guessed that letter.";

        return;
    }

    hangmanGame.guessedLetters.push(guessedLetter);

    for (
        i = 0;
        i < hangmanGame.selectedWord.length;
        i++
    ) {
        if (
            hangmanGame.selectedWord.charAt(i) ===
            guessedLetter
        ) {
            letterIsInWord = true;
        }
    }

    if (letterIsInWord === false) {
        hangmanGame.incorrectGuesses =
            hangmanGame.incorrectGuesses + 1;
    }

    inputError.textContent = "";

    updateWordDisplay();
    updateGuessedLetters();
    updateHangmanImage();
    checkGameResult();
}



function updateWordDisplay() {
    var displayedWord = "";
    var currentLetter;
    var letterWasGuessed;
    var i;
    var j;

    for (
        i = 0;
        i < hangmanGame.selectedWord.length;
        i++
    ) {
        currentLetter =
            hangmanGame.selectedWord.charAt(i);

        letterWasGuessed = false;

        for (
            j = 0;
            j < hangmanGame.guessedLetters.length;
            j++
        ) {
            if (
                hangmanGame.guessedLetters[j] ===
                currentLetter
            ) {
                letterWasGuessed = true;
            }
        }

        if (letterWasGuessed === true) {
            displayedWord =
                displayedWord +
                currentLetter.toUpperCase() +
                " ";
        } else {
            displayedWord =
                displayedWord + "_ ";
        }
    }

    wordDisplay.textContent = displayedWord;
}



function updateGuessedLetters() {
    var displayedLetters = "";
    var i;

    if (
        hangmanGame.guessedLetters.length === 0
    ) {
        guessedLettersDisplay.textContent =
            "None";

        return;
    }

    for (
        i = 0;
        i < hangmanGame.guessedLetters.length;
        i++
    ) {
        displayedLetters =
            displayedLetters +
            hangmanGame.guessedLetters[i]
                .toUpperCase();

        if (
            i <
            hangmanGame.guessedLetters.length - 1
        ) {
            displayedLetters =
                displayedLetters + ", ";
        }
    }

    guessedLettersDisplay.textContent =
        displayedLetters;
}



function updateHangmanImage() {
    hangmanImage.src =
        "images/hangman-" +
        hangmanGame.incorrectGuesses +
        ".png";

    hangmanImage.alt =
        "Hangman drawing with " +
        hangmanGame.incorrectGuesses +
        " incorrect guesses";

    incorrectGuessDisplay.textContent =
        hangmanGame.incorrectGuesses;
}



function checkGameResult() {
    var allLettersGuessed = true;
    var currentLetter;
    var letterWasGuessed;
    var i;
    var j;

    for (
        i = 0;
        i < hangmanGame.selectedWord.length;
        i++
    ) {
        currentLetter =
            hangmanGame.selectedWord.charAt(i);

        letterWasGuessed = false;

        for (
            j = 0;
            j < hangmanGame.guessedLetters.length;
            j++
        ) {
            if (
                hangmanGame.guessedLetters[j] ===
                currentLetter
            ) {
                letterWasGuessed = true;
            }
        }

        if (letterWasGuessed === false) {
            allLettersGuessed = false;
        }
    }

    if (allLettersGuessed === true) {
        endGame(true);
    } else if (
        hangmanGame.incorrectGuesses >=
        hangmanGame.maximumIncorrectGuesses
    ) {
        endGame(false);
    }
}



function endGame(playerWon) {
    hangmanGame.gameIsOver = true;

    letterInput.disabled = true;
    guessButton.disabled = true;
    playAgainButton.hidden = false;

    resultArea.classList.add("showResult");

    if (playerWon === true) {
        resultHeading.textContent =
            "You Won!";

        resultMessage.textContent =
            "You correctly guessed the word " +
            hangmanGame.selectedWord.toUpperCase() +
            ".";

        resultArea.classList.add("win");
    } else {
        resultHeading.textContent =
            "You Lost!";

        resultMessage.textContent =
            "The correct word was " +
            hangmanGame.selectedWord.toUpperCase() +
            ".";

        resultArea.classList.add("loss");

        showFullWord();
    }
}



function showFullWord() {
    var fullWord = "";
    var i;

    for (
        i = 0;
        i < hangmanGame.selectedWord.length;
        i++
    ) {
        fullWord =
            fullWord +
            hangmanGame.selectedWord
                .charAt(i)
                .toUpperCase() +
            " ";
    }

    wordDisplay.textContent = fullWord;
}



guessForm.addEventListener(
    "submit",
    function (event) {
        var guessedLetter;
        var letterPattern;

        event.preventDefault();

        guessedLetter =
            letterInput.value
                .trim()
                .toLowerCase();

        letterPattern = /^[a-z]$/;

        if (
            letterPattern.test(
                guessedLetter
            ) === false
        ) {
            inputError.textContent =
                "Please enter one letter from A to Z.";

            letterInput.value = "";
            letterInput.focus();

            return;
        }

        processGuess(guessedLetter);

        letterInput.value = "";

        if (
            hangmanGame.gameIsOver === false
        ) {
            letterInput.focus();
        }
    }
);



playAgainButton.addEventListener(
    "click",
    function () {
        startGame();
    }
);



fetch("data/words.json")
    .then(function (response) {
        if (response.ok === false) {
            throw new Error(
                "Could not load words.json"
            );
        }

        return response.json();
    })
    .then(function (wordData) {
        hangmanGame.wordCollection =
            wordData;

        startGame();
    })
    .catch(function (error) {
    console.log(error);

    hintDisplay.textContent =
        "The word file could not be loaded.";

    wordDisplay.textContent = "Error";

    inputError.textContent =
        "Error: " + error.message;

    letterInput.disabled = true;
    guessButton.disabled = true;
});

