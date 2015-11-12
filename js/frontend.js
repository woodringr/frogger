//// TODO:
var FrontEnd = function() {
    this.init();
    ctx.lineWidth = 20;
    ctx.font = "900 25pt Orbitron ";
    ctx.font = "900 25pt Oswald";
    ctx.textAlign = "center";
    this.alertStep = 100;
    this.mouseXY = {
        clientX: 0,
        clientY: 0
    };
    this.sound = "";
  //  ctx.save();
};



// Init Alerts
FrontEnd.prototype.init = function() {
    this.currScore = 0;
    this.alertStep = 100;
};


FrontEnd.prototype.doAlert = function(pAlert) {
    switch (pAlert) {
        case 'RoyalHit':
            if (game.state < CONST.STATES.startKiss) {
                game.state = CONST.STATES.startKiss;
            }
            if (this.drawAlert('!! KISS !!', CONST.VIEW.alertSlow)) {
                 if (game.state == CONST.STATES.startKiss) {
                    game.state = CONST.STATES.endKiss;
                    document.dispatchEvent(new CustomEvent('kissdone'));
                }
            }
            break;

        case 'EnemyHit':
            if (game.state < CONST.STATES.collisionStart) {
                game.state = CONST.STATES.collisionStart;
            }
            if (this.drawAlert('!! Ouch !!', CONST.VIEW.alertSlow)) {
                 if (game.state == CONST.STATES.collisionStart) {
                    game.state = CONST.STATES.collisionEnd;
                    document.dispatchEvent(new CustomEvent('playerhit'));
                }
            }
            break;

        case 'NextLEvel':
            if (game.state < CONST.STATES.newLevelStart) {
                game.state = CONST.STATES.newLevelStart;
                this.playSound("newlevel");
            }
            if (this.drawAlert('New Level', CONST.VIEW.alertFast)) {
                if (game.state == CONST.STATES.newLevelStart) {
                    game.state =  CONST.STATES.newLevelEnd;
                    document.dispatchEvent(new CustomEvent('leveldone'));
                }
            }
            break;

        case 'GameOver':
            if (game.state < CONST.STATES.gameOverStart) {
                game.state = CONST.STATES.gameOverStart;
                this.playSound("GameOver");
            }
            if (this.drawAlert('You Lost', CONST.VIEW.alertFast)) {
                if (game.state == CONST.STATES.gameOverStart) {
                    game.state = CONST.STATES.gameOverEnd;
                    document.dispatchEvent(new CustomEvent('gameover'));
                }
            }
            break;

    }

};


FrontEnd.prototype.drawStats = function(pLives,pKeys,pTimeLeft) {
    ctx.save();

    // Draw lives
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("Life: ", 10, CONST.VIEW.height-20);
    for (var i = 0; i < pLives; i++) {
        ctx.drawImage(Resources.get('images/heart.png'), 70 + (i*36), CONST.VIEW.height-50-15, 36-5,53);
    }


    // Draw Keys
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.textAlign = "left";
    ctx.fillText("Keys:", CONST.VIEW.width/2 +80, CONST.VIEW.height-20);
    for (var i = 0; i < pKeys; i++) {
        ctx.drawImage(Resources.get('images/key.png'), 400 + (i*36), CONST.VIEW.height-50-15, 36,53);
    }


    // Draw time left
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("Time: " , CONST.VIEW.width - 85, 35);

    ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
    if (pTimeLeft < 10) {
        ctx.fillStyle = "rgba(255, 0, 0, 1.0)";
        if (!game.soundPlaying) this.playSound("OutOfTimeWarn");
    }
    ctx.fillText(pTimeLeft , CONST.VIEW.width - 30, 35);

    ctx.restore();
};



// Draw the score
FrontEnd.prototype.drawScore = function(score)
{
    ctx.save();

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("Score:", 10, 35);
    ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
    ctx.fillText(("00000" + score).slice(-5), 140, 35);

    ctx.restore();
};


// Dispalys the score up to the new bonus value
FrontEnd.prototype.updateScore = function(pStartCount, pEndCount) {
    if (this.currScore < pStartCount)
        this.currScore = pStartCount;
    if (this.currScore < pEndCount)
        this.drawScore(this.currScore += 1);
    else
        this.drawScore(pEndCount);
};





// Displays an alert by darkening the screen and displaying a message
FrontEnd.prototype.drawAlert = function(pMessage, pSpeed ) {

    if ((this.alertStep >= 0)) {
        ctx.save();

        var count = this.alertStep;


        // Draw semi transparent circles
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        for (i=0;i<17;i++){
            ctx.beginPath();
            ctx.arc(275,275,10+10*((count/2)+i),0,Math.PI*((count-count)+i),true);
            ctx.fill();
        }

        // Draw text with a shadow
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
        ctx.fillText(pMessage, CONST.VIEW.width / 2+1, CONST.VIEW.height/2+1);
        ctx.fillStyle = "rgba(0, 0, 255, 1.0)";
        ctx.fillText(pMessage, CONST.VIEW.width / 2, CONST.VIEW.height/2);

        this.alertStep -= pSpeed;
        ctx.restore();
        return false;
    }
    else {
        return true;
    }
};


// Plays a named sound file. Interupts any currently playing sound
FrontEnd.prototype.playSound = function (pName) {
    if (!game.soundPlaying){
        this.initSound;
    }
    game.soundCurrent = new Audio("sounds/" + pName + ".mp3");
    game.soundCurrent.onended = function() {
        game.soundPlaying =  false;
    };
    game.soundCurrent.currentTime = 0;
    game.soundCurrent.play();
    game.soundPlaying = true;
};

    // Stop the current palying sound   TODO: probably should go in to GUI code
    // Prevent any errors from reporting
FrontEnd.prototype.initSound = function(){
    try {
        game.soundPlaying = false;
        game.soundCurrent.pause();
    }
    catch(e){}
};


// Drop down the start dialog
FrontEnd.prototype.startMenu = function () {
    game.state = CONST.STATES.beginGameStart;
     $('#gameStartModal').modal();
};



// Start dialogs click event setup to call back into main game
$( "#startBtn" ).click(function(e) {

    if ($('input[type="radio"]').prop("checked"))
        game.gender = CONST.GENDER.boy;
    else
        game.gender = CONST.GENDER.girl;

    document.dispatchEvent(new CustomEvent('begingame'));
});
