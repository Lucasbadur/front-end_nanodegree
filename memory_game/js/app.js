/*
 * Create a list that holds all of your cards
 */

let deck = [
            "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt",
            "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle",
            "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb",
            "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube",
            ];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array)
{
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0)
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Initializes everything
$(resetGame);

// Event Listeners
// Listener for the clicking of a card
$(".card").click(onClick);
// Listener for clicking the restart button
$(".restart").click(resetGame);
// Listener for clicking the "play again" button on the modal popup, resets everything
$(".play-again").click(resetGame);

let gameStarted = false;
let open = [];
let matches = 0;
let moveCount = 0;
let starRating = 3;
let timer =
{
    minutes: 0,
    seconds: 0,
};
let timerIntervalHandler = 0;

// Moves for each difficulty
const twoStar = 20;
const oneStar = 30;

// "Stopwatch" code, inspired in part by code from Daniel_Hug at jsfiddle.net/Daniel_Hug/pvk6p/
function timerEvent()
{
    // Boolean value impedes timer from starting before the first click
    if (gameStarted)
    {
        let time;
        timer.seconds++;
        // If seconds get to 60, reset to 0 and increment a minute
        if (timer.seconds >= 60)
        {
            timer.seconds = 0;
            timer.minutes++;
            time = String(timer.seconds) + " s";
        }
        else
        {
            time = String(timer.minutes) + "m " + String(timer.seconds) + "s";
        }
        
        $(".timer").text(time);
    }
};

// "Main" function, is called everytime a card is clicked
function onClick()
{
    gameStarted = true;
    if (canOpen($(this)))
    {
    	// If the array of open cards has no open cards, opens the clicked one
        if (open.length === 0)
        {
            openCard( $(this) );

        }
        // If there's already one open card, opens another one and checks it
        // for a match, increments and updates the move counter.
        else if (open.length === 1)
        {
            openCard( $(this) );
            moveCount++;
            updateMoveCount();
            checkMatch();
        }
    }
};

// Resets the stopwatch display and resets the periodic interval
function resetTimer()
{
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0m 0s");

    clearInterval(timerIntervalHandler);
    timerIntervalHandler = setInterval(timerEvent, 1000);
};

// Function for shuffling cards, attributing a shuffled deck item from the array
function shuffleCards()
{
    let index = 0;
    deck = shuffle(deck);
    $.each($(".card i"), function()
        {
            $(this).attr("class", deck[index]);
            index++;
        });
};

// Function for showing the end popup (modal)
function showModal()
{
    $("#end-modal").css("display", "block");
};

// Function for hiding the end popup (modal)
function hideModal()
{
    $("#end-modal").css("display", "none");
}

// This function checks the move count against the required moves for each ranking
// and updates the star rating accordingly
function updateMoveCount()
{
    $(".moves").text(moveCount);

    if (moveCount === twoStar)
    {
        $(".fa-star").last().attr("class", "fa fa-star-o");
        $(".num-stars").text("2");
    }
    else if (moveCount === oneStar)
    {
        $(".fa-star").last().attr("class", "fa fa-star-o");
        $(".num-stars").text("1");
    }
    else if (moveCount < twoStar)
    {
    	$(".fa-star-o").attr("class", "fa fa-star");
    	$(".num-stars").text("3");
    }
};

// This function returns whether or not a card can be opened
// It can't be opened if it is matched or already open
function canOpen(card)
{
    let can = true;

    if (card.hasClass("open"))
    {
        can = false;
    }
    if (card.hasClass("match"))
    {
        can = false;
    }

    return can;
};

// This function determines if the game has ended, using the number
// of matched cards
function gameEnd()
{
    if (matches === 2)
    {
    	clearInterval(timerIntervalHandler);
        return true;
    }
    else
    {
        return false;
    }
};

// This function checks whether or not the open pair of cards is a match,
// and acts accordingly, calling the subsequent functions
function checkMatch()
{
    if ( open[0].children().attr("class") === 
    	 open[1].children().attr("class")
    	)
    {
    	// Calls foundMatch with a delay, to smoothen the transition
        setTimeout(foundMatch, 500);
    }
    else
    {
    	// Calls notMatchBackground first, to let the person see that it was not a match
    	// using the red backgrounds as a indicator for the error
    	setTimeout(notMatchBackground, 400);
    	// Calls notMatch after, with a bigger delay, to close the open cards after the
    	// user has seen them and restore their original background
        setTimeout(notMatch, 1200);
    }
};

// This function gets called when there is a match,
//and adds the class "match" to the open cards
function foundMatch ()
{
    open.forEach(function(card)
    {
        card.addClass("match");
    });
    open = [];
    matches = matches + 2;

    if (gameEnd())
    {
        showModal();
    }
};

// Toggles the class "wrong", which changes the background of the open card to red
function notMatchBackground()
{
    open.forEach(function(card)
    {
        card.toggleClass("wrong");
    });
};

// Closes the open cards, un-toggles the "wrong" class, to return the background
// to the original color, and clears the open array.
function notMatch() 
{
    open.forEach(function(card)
    {
        card.toggleClass("open");
        card.toggleClass("show");
        card.toggleClass("wrong");
    });
    open = [];
};

// If a card isn't open, opens it. If it is already open, does nothing.
function openCard(card)
{
    if (!card.hasClass("open"))
    {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

// Initializes everything.
function resetGame()
{
    open = [];
    matches = 0;
    moveCount = 0;
    hideModal();
    resetTimer();
    updateMoveCount();
    $(".card").attr("class", "card");
    shuffleCards();
    gameStarted = false;
};