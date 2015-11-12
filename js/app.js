

// This is the Game proper
var Game = function(){
    this.soundPlaying = false;
    this.soundCurrent = new Audio("");
    this.state = CONST.STATES.run;
    this.level = 1;
    this.gameOver = false;
    this.gender = CONST.PLAYER.boy;
    this.timeLeft = 30;
    this.currTime = Date.now();
    this.score = 0;
    this.lives = 3;
    this.keys = 0;
    this.isDead = false;
    this.lastScore = 0;


// try to get rid of thse and work them into game states
    this.collisionTriggered = false;
    this.newLevel = false;

    // Inits the game to the begining state
    this.init = function() {
        this.frontEnd   =  new FrontEnd();
        this.player     =  new Player();
        this.royal      =  new Royal();
        this.enemies    = [new Enemy()];

        this.lives = 3;
        this.keys = 0;
        this.isDead = false;
        this.level = 1;
        this.initTime();
        this.initScore();
        this.newLevel = false;
        this.gameOver = false;
        this.gameWon = false;
        this.state = CONST.STATES.run;
    }

    this.initLevel = function() {
        this.level += 1;
        this.initTime();
        this.player.init();
        this.frontEnd.init();
        this.enemies.push(new Enemy());
        this.state = CONST.STATES.run;
    }

    //
    this.initScore = function() {
        this.score = 0;
        this.lastScore = 0;
    };

     // Reset time left
    this.initTime = function() {
        this.timeLeft = 30;
    };

    // Main update routine called by the game engine
    //      Stats
    //      royal
    //      Player
    //      enemy[s]
    // If the game state is Game Won then use an alternate update routine
    // for the Mrs Pacman Homage animation
    this.update = function(dt) {
         if (this.gameWon) {
            this.player.forEach(function(p) {
                p.update(dt);
            });
            nextMove();

        } else {
            this.player.collided =  this.hasCollision(this.enemies);
            this.newLevel = (this.player.y <= CONST.VIEW.waterRow);
            this.updateTime();

            this.royal.update();
            this.player.update();

            this.enemies.forEach(function(enemy) {
                enemy.update(dt);
            });
        }
    };


    // Main drawing callback from the game engine
    //      The order we draw things is important
    //      If we draw the royal first then the score, it will appear as if the royal is moving behind the score - yuk
    //
    //      The game board has already been drawn by the game engine before it calles here
    //      If the game was won then we render a differnt game board as my homage to the first video game
    //      I ever played, Mrs Pacman..
    //      Otherwise we finish drainng the rest of the normal game play which is..
    //      Draw the Score
    //      Draw time left,  life (hearts) and keys
    //      Draw all the enemies
    //      Draw the royal (and evil lady bug)
    //      Draw the Player
    //
    //      Draw Event Alerts
    //          Collision
    //          Game OVer
    //          and so on..
    this.render = function() {

        // Draw score and stats
        if (!this.newLevel || this.gameWon) {
            this.frontEnd.drawScore(this.score);
        }
        this.frontEnd.drawStats(this.lives,this.keys,this.timeLeft)

        // If the game is won then we draw the altrnate game board of sprites and hearts
        if (this.gameWon) {
            this.player.forEach(function(p) {
                p.render();
            });
            hearts.forEach(draw);

        } else {    // Draw the normal game baord elements
            // Draw enemies, the royal, and the player
            this.enemies.forEach(function(enemy) {
                enemy.render();
            });
            this.royal.render();
            this.player.render();

            // At this point we could possibly be drawing special events like
            // a new level alert, or a collision alert or game over alert and so on
            // If so, then call the front end to draw another frame in that animation
            if (this.newLevel) {
                this.score = this.level * 50 + this.timeLeft;
                this.frontEnd.doAlert('NextLEvel');
                this.frontEnd.updateScore(this.lastScore, this.score);
            }
            if (this.collisionTriggered) {
                if (this.player.gotKissed)
                    this.frontEnd.doAlert('RoyalHit');
                else
                    this.frontEnd.doAlert('EnemyHit');
            } else if (this.isDead){
                this.gameOver = true;
                this.frontEnd.doAlert('GameOver');
            }
        }
    };




////
    // Updates timeout
    this.updateTime = function() {
        if (!(this.state >= CONST.STATES.outOfTimeStart)) {
            if (Date.now() - this.currTime > 1000) {
                this.currTime = Date.now();
                if ((this.timeLeft -= 1) == 0) {
                    this.isDead = ((this.lives += -1) <= 0);
                    this.initTime();
                    this.frontEnd.initSound();
                    if (!this.isDead){
                        game.frontEnd.playSound("OutOfTime");
                    }
                }
            }
        }
    };


    // Check to see if player collided with any targets
    // This routine is expecting an array of targets (enemies)
    // So to test a single target, example: when the palyer reaches the royal in the water.
    // Make sure you pass in the single target wrapped in an array
    this.hasCollision = function(pTestTargets) {
        if (this.state == CONST.STATES.run) {
            for (var i = 0; i < pTestTargets.length; i++)
            {   var test = pTestTargets[i];
                if (this.player.x < test.x + CONST.ENEMY.MASK.width  && this.player.x + CONST.ENEMY.MASK.width  > test.x &&
                    this.player.y < test.y + CONST.ENEMY.MASK.height && this.player.y + CONST.ENEMY.MASK.height > test.y) {
                    this.state = CONST.STATES.collisionStart;
                    this.collisionTriggered = true;
                    if (test.hitSound!='') {
                        game.frontEnd.playSound(test.hitSound);
                    }
                    return true;
                    break;
                }
            }
        }
        return false;
    };



    // TODO: I dont like naming convention anymore here.. change it

    //
    // Callbacks from other objets
    //

    // Callback after the start game button is clicked
    this.beginGameCallback = function() {
        this.frontEnd.initSound();
        this.init();
        this.player.sprite = this.player.sprites[game.gender];
        this.royal.sprite  = this.royal.sprites[game.gender];
        this.state = CONST.STATES.run;
    };

    // Callback after game over animation finishes
    this.gameOverCallback = function() {
        this.init();
        game.frontEnd.startMenu();

    }

     // Callback after game over animation finishes
    this.gameWonCallback = function() {
        this.player     =  new Player();
        this.player.gotKissed = false;
        this.collisionTriggered = false;
        this.initLevel();
        this.init();
        game.frontEnd.startMenu();
    }

    // Callback after the collision animation finishes
    this.collisionCallback = function() {
        this.state = CONST.STATES.run;
        this.isDead = ((this.lives += -1) <= 0);
        this.player.init();
        this.frontEnd.init();
        this.collisionTriggered = false;
    };


    // Callback after the New Level Notiication is done
    this.newLevelCallback = function() {
        this.lastScore = this.score;
        this.state = CONST.STATES.run;
        if (!(this.player.gotKissed = this.hasCollision([this.royal]))) {
            this.initLevel();
        }
    };


    this.kissCallback = function() {
        this.keys +=1;
        this.player.gotKissed = false;
        this.collisionTriggered = false;
        if (this.keys >= 3) {
            this.initGameWon();
        } else {
            this.initLevel();
        }
    };


    //
    // Special game board to play the game won animation
    // As my homage to video games of the past, I will play out
    // the "Act 1: they meet" intermission animation from the Mrs Pacman game
    // This init routine wipes out the player variable and rebuilds it as an array
    // with sprites needed for the animantion. It will be turned back to normal after the
    // Act 1 animation is done.
    //
    this.initGameWon = function() {
        initHomage();

    };


};  // End of game var



// Start the game
var game = new Game();
game.init();
game.frontEnd.startMenu();




//
// Event Listeners
//

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (allowedKeys[e.keyCode] !== undefined){
        e.preventDefault();
    }

    if (!game.gameOver) {
        game.player.handleInput(allowedKeys[e.keyCode]);
    }
});


document.addEventListener('begingame', game.beginGameCallback.bind(game));
document.addEventListener('gameover',  game.gameOverCallback.bind(game));
document.addEventListener('gamewon',   game.gameWonCallback.bind(game));
document.addEventListener('playerhit', game.collisionCallback.bind(game));
document.addEventListener('leveldone', game.newLevelCallback.bind(game));
document.addEventListener('kissdone',  game.kissCallback.bind(game));




////
/* event handler for touch events */
ctx.canvas.addEventListener('touchstart',   handleTouch, false);

////
/**
 * Gets the position of the touch event and converts it to the direction,
 * which than gets passed to player.handleInput for processing
 * @param e - event object
 */
function handleTouch(e) {
    var touch = {
        x: e.touches[0].pageX - ctx.canvas.offsetParent.offsetLeft - ctx.canvas.offsetLeft,
        y: e.touches[0].pageY - ctx.canvas.offsetParent.offsetTop - ctx.canvas.offsetTop - 70
    };
    var move;

    if (touch.x < game.player.x &&
        touch.y > game.player.y &&
        touch.y < game.player.y + CONST.PLAYER.MASK.y) {
        move = 'left';
    } else if (touch.y < game.player.y &&
        touch.x > game.player.x &&
        touch.x < game.player.x + CONST.PLAYER.MASK.x) {
        move = 'up';
    } else if (touch.x > game.player.x + CONST.PLAYER.MASK.x &&
        touch.y > game.player.y &&
        touch.y < game.player.y + CONST.PLAYER.MASK.y) {
        move = 'right';
    } else if (touch.y > game.player.y + CONST.PLAYER.MASK.y &&
        touch.x > game.player.x &&
        touch.x < game.player.x + CONST.PLAYER.MASK.x) {
        move = 'down';
    }

    /* condition needed to detect button click on the Restart button */
    if (!game.gameOver && move !== undefined){
        e.preventDefault();
    }

    game.player.handleInput(move);
}


