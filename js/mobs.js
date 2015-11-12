// Royal - Create our royal goal
var Royal = function() {
    this.curDir = 1;
    this.hitSound = 'HitRoyal';
    this.x = CONST.ROYAL.DEFAULT.x;
    this.y = CONST.ROYAL.DEFAULT.y;
    this.sprites = [['images/enemy-bug.png', 'images/char-princess-girl.png'],
                    ['images/enemy-bug.png','images/char-prince-boy.png']];
    this.sprite = this.sprites[0];
    this.moveSpeed = CONST.ROYAL.DEFAULT.moveSpeed;
};

// Updates the Royal's position
Royal.prototype.update = function() {
    if (!game.collisionTriggered && !game.newLevel){
        if (this.x + CONST.ROYAL.DEFAULT.w > CONST.VIEW.width || this.x < 0){
            this.curDir = this.curDir * -1;
        }
        this.x += this.curDir*this.moveSpeed;
    }
};

// Draws the Royal on the game screen
Royal.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[0]), this.x, this.y);
    ctx.drawImage(Resources.get(this.sprite[1]), this.x, this.y-20);
};





// Player - Construct our player
var Player = function() {
    this.sprites = [['images/char-prince-boy_body.png','images/char-prince-boy_head.png'],
                    ['images/char-princess-girl_body.png','images/char-princess-girl_head.png']];
    this.sprite = this.sprites[0];
    this.moveUP = 0;
    this.moveDN = 0;
    this.moveLT = 0;
    this.moveRT = 0;
    this.moveDone = true;
    this.isDead = false;
    this.collided = false;
    this.gotKissed = false;
    this.wobble = new Wobble();
    this.wobble.enable(true);
    this.x = CONST.PLAYER.DEFAULT.x;
    this.y = CONST.PLAYER.DEFAULT.y;
    this.moveSpeed = CONST.PLAYER.DEFAULT.moveSpeed;
};


// Resets the player's position
Player.prototype.init = function() {
    this.moveUP = this.moveDN = this.moveLT = this.moveRT= 0;
    this.x = CONST.PLAYER.DEFAULT.x;
    this.y = CONST.PLAYER.DEFAULT.y;
    this.collided = false;
    this.gotKissed = false;
};


// Updates player's position
Player.prototype.update = function() {
    if ((!this.gameWon) && (this.collided || this.gotKissed || (!this.state == CONST.STATES.run))) {
    //if (!this.state == CONST.STATES.run){
        this.moveUP=this.moveDN=this.moveLT=this.moveRT=0;
        console.log('clering keys');
    }
    else {
        if (this.moveUP != 0)
            if (this.y > this.moveUP) this.y -= this.moveSpeed;
            else this.moveUP = 0;
        else if (this.moveDN != 0)
            if (this.y < this.moveDN) this.y += this.moveSpeed;
            else this.moveDN = 0;
        else if (this.moveLT != 0)
            if (this.x > this.moveLT) this.x -= this.moveSpeed;
            else this.moveLT = 0;
        else if (this.moveRT != 0)
            if (this.x < this.moveRT) this.x += this.moveSpeed;
                else this.moveRT = 0;
    }
};



// Draws the player on screen
Player.prototype.render = function() {
    //ctx.drawImage(Resources.get(this.sprite[0]), this.x, this.y);
    //ctx.drawImage(Resources.get(this.sprite[1]), this.x, this.y+ this.wobble.amt()+2);
    for (var i = 0; i < this.sprite.length; i++) {
        ctx.drawImage(Resources.get(this.sprite[i]), this.x, this.y + ((i>0)?this.wobble.amt()+2:0));
    }
};



// TODO: change all the ! && to ||

//// TODO: I dont like the  name
// Handles keyboard input
Player.prototype.handleInput = function(pDirection) {
    if (game.state != CONST.STATES.run) return;
    if (!this.collided && !this.gotKissed && !this.isDead && !game.newLevel ){
        var tempMove = 0;
        if (this.moveUP != 0) this.y = this.moveUP;
        if (this.moveDN != 0) this.y = this.moveDN;
        if (this.moveLT != 0) this.x = this.moveLT;
        if (this.moveRT != 0) this.x = this.moveRT;
        this.moveUP = this.moveDN = this.moveLT = this.moveRT =0;
        switch (pDirection){
            case "left":
                this.moveLT =   (( (this.x - CONST.PLAYER.MASK.x) > 0) ? this.x - CONST.PLAYER.MASK.x : this.moveLT );
                //tempMove = this.x - CONST.PLAYER.MASK.x;
                //if (tempMove > 0){
                //    this.moveLT = tempMove;
                //}
                break;
            case "up":
                this.moveUP = ( ( (this.y - CONST.PLAYER.MASK.y) > -CONST.PLAYER.DEFAULT.h) ? (this.y - CONST.PLAYER.MASK.y) :  this.moveUP );
/*
                tempMove = this.y - CONST.PLAYER.MASK.y;
                if (tempMove > -(CONST.PLAYER.DEFAULT.h)){
                //if (tempMove > 0){
                    this.moveUP = tempMove;
                }
*/
                break;
            case "right":
                tempMove = this.x + CONST.PLAYER.MASK.x;
                if (tempMove < (CONST.VIEW.width - CONST.PLAYER.DEFAULT.w +10)){
                //if (tempMove < (CONST.VIEW.width )){
                    this.moveRT = tempMove;
                }
                break;
            case "down":
                tempMove = this.y + CONST.PLAYER.MASK.y;
                if (tempMove < (CONST.VIEW.height - CONST.PLAYER.DEFAULT.h)-25){
                    this.moveDN = tempMove;
                }
                break;
        }
    }
};


Player.prototype.moveTo = function(pLeft, pRight, pUp, pDown) {
var e=-999
    if (pLeft!=e)  this.moveLT = pLeft;
    if (pRight!=e) this.moveRT = pRight;
    if (pUp!=e)    this.moveUP = pUp;
    if (pDown!=e)  this.moveDN = pDown;
 };


Player.prototype.moveComplete = function() {
    return (this.moveLT ==0) && (this.moveRT == 0) && (this.moveUP == 0) && (this.moveDN == 0);
};



//  The enemy object
var Enemy = function() {
    this.velo = rndVelo(game.level);
    this.hitSound = 'HitEnemy';
    this.sprite = CONST.ENEMY.DEFAULT.sprites[rnd(0,CONST.ENEMY.DEFAULT.sprites.length)];
    this.x = CONST.ENEMY.DEFAULT.x;
    this.y = CONST.ENEMY.DEFAULT.streetRows[rnd(0,CONST.ENEMY.DEFAULT.streetRows.length)];
};

// Init the enemy
Enemy.prototype.init = function() {
    this.velo = rndVelo(game.level);
    this.x = CONST.ENEMY.DEFAULT.x;
    this.y = CONST.ENEMY.DEFAULT.streetRows[rnd(0,CONST.ENEMY.DEFAULT.streetRows.length)];
};

// Updates the enemy's location
Enemy.prototype.update = function(pDT) {
    if (game.state != CONST.STATES.run) {
        return;
    }
    else {
        this.x += pDT * this.velo;
        if (this.x > CONST.VIEW.width + 100){
            this.init();
        }
    }
};

// Draw the enemy
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



//
// Helper classes and functions
//

// introduces a back and forth wobble value.
// Used to help animate with subtle variations.
var Wobble = function() {
    var delta = 0,
        deltaMax = 2,
        deltaInc = -0.1,
        enabled = false;
    setInterval(cycleStep, 1000 / 30);

    function cycleStep() {
        if (enabled) {
            delta += deltaInc;
            if (delta > deltaMax || delta < -deltaMax) {
                deltaInc *= -1;
            }
        }
    };

    this.enable = function(pEnable) {
        enabled = pEnable;
    };

    this.amt = function() {
        return delta;
    };

};


function movementComplete() {
    var result = false;
    for (var i = 0; i < game.player.length; i++) {
        //result = result  || (!(game.player[i].moveLT ==0) && (game.player[i].moveRT == 0) && (game.player[i].moveUP == 0) && (game.player[i].moveDN == 0));
        result = result  || (!game.player[i].moveComplete());
    }
    return !result;
};



// Calculates a random velocity based on level.
// Each level is assigned a velocity 25 more than the last.
// 5 levels max. After level 5 the base velocity increases by 1
// level   velocity
// ------  ----------
//   1       25
//   2       25,50
//   3       25,50,75
//   4       25,50,75,100
//   5       25,50,75,100,125
//   6             50,75,100,125,150
//   7                    75,100,125,150,175
// and so on..
function rndVelo(pLevel) {
    return rnd( ((pLevel < 5) ? 1 : pLevel)+1  ,pLevel) *25;
};

function rnd(pLow, pHight) {
    return Math.floor(Math.random() * pHight) + pLow;
};
