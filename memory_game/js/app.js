/*
 * Create a list that holds all of your cards
 */


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

// Shuffles the cards on startup
$(shuffleCards);

// Event Listeners
$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);

let deck = [
            "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
            "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle",
            "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb",
            "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube",
            ];

let gameStarted = false;
let open = [];
let matches = 0;
let moveCount = 0;
let starRating = 3;
let timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

// Moves for each difficulty
const twoStar = 20;
const oneStar = 30;

// "Stopwatch" code, inspired in part by code from Daniel_Hug at jsfiddle.net/Daniel_Hug/pvk6p/
function timerEvent()
{
    // Boolean value impedes timer from starting before the first click
    if (gameStarted)
    {
        timer.seconds++;
        // If seconds get to 60, reset to 0 and increment a minute
        if (timer.seconds >= 60)
        {
            timer.seconds = 0;
            timer.minutes++;
        }
    
        let time = String(timer.minutes) + ":" + String(timer.seconds);
        $(".timer").text(time);
    }
};

function resetTimer()
{
    clearInterval(timer.clearTime);
    // clearInterval method learned from W3Schools
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(timerEvent, 1000);
};

function shuffleCards()
{
    deck = shuffle(deck);
    let index = 0;
    $.each($(".card i"), function()
    {
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    resetTimer();
};

function showModal()
{
    $("#end-modal").css("display", "block");
};

function hideModal()
{
    $("#end-modal").css("display", "none");
}

function resetStars()
{
    $(".fa-star-o").attr("class", "fa fa-star");
    starRating = 3;
    $(".num-stars").text(String(starRating));
};

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
};

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

function gameEnd()
{
    if (matches === 16)
    {
        return true;
    }
    else
    {
        return false;
    }
};

function checkMatch()
{
    if (open[0].children().attr("class")===open[1].children().attr("class"))
    {
        return true;
    }
    else
    {
        return false;
    }
};

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
        clearInterval(timer.clearTime);
        showModal();
    }
};

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

function notMatchBackground()
{
    open.forEach(function(card)
    {
        card.toggleClass("wrong");
    });
};

function openCard(card)
{
    if (!card.hasClass("open"))
    {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

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
    resetStars();
    gameStarted = false;
};

function onClick()
{
    gameStarted = true;
    if (canOpen( $(this) ))
    {

        if (open.length === 0)
        {
            openCard( $(this) );

        }
        else if (open.length === 1)
        {
            openCard( $(this) );
            moveCount++;
            updateMoveCount();

            if (checkMatch())
            {
                setTimeout(foundMatch, 500);
            }
            else
            {
                setTimeout(notMatchBackground, 400);
                setTimeout(notMatch, 1200);
            }
        }
    }
};

function playAgain()
{
    resetGame();
};