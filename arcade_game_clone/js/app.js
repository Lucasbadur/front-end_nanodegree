// Enemies our player must avoid
var Enemy = function( x, y, speed ) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    if ( this.y < 70 ) {
        // The last enemy is the "boss" enemy
        this.sprite = 'images/enemy-bug-boss.png';
    }
    else {
        this.sprite = 'images/enemy-bug.png';
    }

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function( dt ) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + ( this.speed * dt );

    // If the enemy and the player are close enough,
    // this registers a collision and the player is reset
    if ( player.x < ( this.x + 60 ) && ( player.x + 35 ) > this.x &&
        player.y < ( this.y + 25 ) && ( player.y + 30 ) > this.y ) {
        player.x = 200;
        player.y = 380;
    }

    // After the enemy goes far enough right and is off-screen,
    // its position is reset
    if (this.x > 550) {
        this.x = -100;
        this.speed = 100 + Math.floor( Math.random() * 512 );
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function( ) {
    this.x = 200;
    this.y = 380;
    this.speed = 50;
    this.sprite = 'images/char-princess-girl.png';
};

Player.prototype.render = function() {
    ctx.drawImage( Resources.get( this.sprite ), this.x, this.y );
};

Player.prototype.update = function() {
    // If the player reaches the top line, he is successful
    // and their position is reset
    if ( this.y < 0 ) {
        this.x = 200;
        this.y = 380;
    }
};

// This function handles input from the keypresses, and also
// the limits for the playing area.
// If the player tries to go beyond the playable
// area, he remains in place.
Player.prototype.handleInput = function( key ) {
    if ( key == 'left' && this.x > 0 ) {
        this.x = ( this.x - ( this.speed + 50 ) );
    }
    else if ( key == 'up' && this.y > 0) {
        this.y = ( this.y - ( this.speed + 30 ) );
    }
    else if ( key == 'right' && this.x < 400) {
        this.x = ( this.x + ( this.speed + 50 ) );
    }
    else if ( key == 'down' && this.y < 380) {
        this.y = ( this.y + ( this.speed + 30 ) );
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var enemyPosition = [ 50, 140, 130, 220 ];
var player = new Player( );
var enemy;

enemyPosition.forEach( function( posY ) {
    enemy = new Enemy( 0, posY, 100 + Math.floor( Math.random() * 512 ) );
    allEnemies.push( enemy );
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
