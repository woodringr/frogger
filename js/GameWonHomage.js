    //
    // Special game board to play the game won animation
    // As my homage to video games of the past, I will play out
    // the "Act 1: they meet" intermission animation from the Mrs Pacman game
    // This init routine wipes out the player variable and rebuilds it as an array
    // with sprites needed for the animantion. It will be turned back to normal after the
    // Act 1 animation is done.
    //
    // this scripted session was rather easy to work in to the nromal game play
    // All that is needed s we usrup the player variable and turn it in to an array of sprites
    // then set a flag (gameWon) that controls 2 other areas
    // When performing the normal UPDATE routine, if this alg is set then an alternate one is called
    // that comes to nextMove() below to pump out th next stage of the animation script
    // the script has 3 states perforn mnext step in script, wait until sprites have stopped moving,
    // moveTo sets a sprite auto moving to the set location in the set direction and finally
    // pause which delays execution inti the given time has passed
    //
var homageState = 0,
    homageStep = 0,
    delayTime = 0,
    calibrationTime = 0,
    calibrationIndex = 0,
    lastMoveSpeed = 0,
    numHearts = 20,
    moveSpeed =2.7,
    hearts = [],
    gravity = 1.7;

function initHomage() {

    // Set new game state and init things
    if (game.state < CONST.STATES.wonGameStart) {
        game.state = CONST.STATES.wonGameStart;
        game.gameWon = true;

        // rebuild the player var as an array. we have the prince, the princess and 2 bugs
        // (player zero is already set to the correct sprites so it is skipped below )
        game.player = [new Player(), new Player(), new Player(), new Player()];
        game.player[1].sprite = ['images/char-princess-girl_body.png','images/char-princess-girl_head.png'];
        game.player[2].sprite = ['images/enemy-bug_left.png'];
        game.player[3].sprite = ['images/enemy-bug_right.png'];

        // The animation needs to run slower than the normal player movement
        game.player.forEach(function(p) {
            p.moveSpeed = moveSpeed;
           // p.hitSound = "";
        });

        homageState = CONST.SCRIPT.STATES.run;
        homageStep = 0;
        calibrationTime = Date.now();
        lastMoveSpeed = moveSpeed;
        game.frontEnd.playSound("TheyMeet");

    }
};

// 0 = 4930
// 1 = 6646
// 2 = 7197
// 3 = 8181
// 4 = 8363

function nextMove()  {
    var e=-999;
    var cali = [4930,6646,7197];

    switch (homageState) {

        // Wait until all sprites have stopped moving
        // NOTE: We need to keep the sound and animation synced up. the 'kiss' at the end of the sound clip
        //       needs to happen jsut as the royals meet up and kiss in step 4 but they where not always doing that.
        //       because while browsers all seem to play the sound clip (which is 8 seconds long) without fail or delay
        //       however, differnt browsers and even the same browser under differnt loads can very
        //       greatly in the animation playback speeds. So here we try to do some rough justice
        //       and attempt to compensate for that. I have a know elapsed timer value for stage 2
        //       if the animation for a perfectly timed animation. To make sure things are timed right
        //       in the wait funciton, I test the true elapsed time against the expected time and
        //       adjust the movement spped of all sprites accordingly to ensure the royals meet up for the kiss
        //       just at the right time. I use 3 known timings
        //       Thisis not foolproof but works well enough.. the granularity and frequency of the call is too low

/*
        case CONST.SCRIPT.STATES.waitMoves:
            if (movementComplete()) {

                if (calibrationIndex==1) {
                    calibrationFactor = Date.now()-calibrationTime;
                    //calibrationDelta = (calibrationFactor / 7197);
                    calibrationDelta = (calibrationFactor / 6646);

console.log(calibrationIndex,calibrationFactor,cali[calibrationIndex],calibrationDelta, moveSpeed, moveSpeed * calibrationDelta);
                    game.player.forEach(function(p) {
                        p.moveSpeed =  moveSpeed * calibrationDelta;
                       // p.hitSound = "";
                    });
                }
*/


/*
        case CONST.SCRIPT.STATES.waitMoves:
            if (movementComplete()) {

                if (calibrationIndex<3) {
                    calibrationFactor = Date.now()-calibrationTime;
                    //calibrationDelta = (calibrationFactor / 7197);
                    calibrationDelta = (calibrationFactor / 6646);
                    calibrationDelta = 0;
//    console.log('zzz', calibrationFactor-cali[calibrationIndex]);
                    if (calibrationFactor>cali[calibrationIndex]){
                        calibrationDelta = +.99
                    } else if (calibrationFactor<cali[calibrationIndex]) {
                        calibrationDelta = -.99
                    }
//console.log(calibrationIndex,calibrationFactor,cali[calibrationIndex],calibrationDelta, moveSpeed, moveSpeed * calibrationDelta);
                    game.player.forEach(function(p) {
                        //p.moveSpeed =  moveSpeed * calibrationDelta;
                        p.moveSpeed =  p.moveSpeed + calibrationDelta;
                       // p.hitSound = "";
                    });
                }
*/



   case CONST.SCRIPT.STATES.waitMoves:

            // Pause until all sprites have stopped moving
            if (movementComplete()) {
                if (calibrationIndex<3) {
                    var calibrationFactor = Date.now()-calibrationTime,
                    calibrationDelta = -(lastMoveSpeed - (lastMoveSpeed * (calibrationFactor / cali[calibrationIndex])));;
                    lastMoveSpeed = lastMoveSpeed + calibrationDelta;
                    game.player.forEach(function(p) {
                        p.moveSpeed =  lastMoveSpeed;
                    });
                }
               calibrationIndex+=1;
               homageState = CONST.SCRIPT.STATES.run;
               homageStep += 1;
            }
            break;

        // Pause until delayTime is reached
        case CONST.SCRIPT.STATES.pause:
            if (Date.now() - delayTime > 0) {
                homageState = CONST.SCRIPT.STATES.run;
                homageStep += 1;
            }
            break;

        // Execute next script step
        case CONST.SCRIPT.STATES.run:
            switch (homageStep) {

                // Starting positions please
                case 0:
                    initPositions(290,370);
                    game.player[0].moveTo(-100,  e,e,e);
                    game.player[2].moveTo(-190,  e,e,e);
                    game.player[3].moveTo(   e,500,e,e);
                    game.player[1].moveTo(   e,590,e,e);

                    homageState = CONST.SCRIPT.STATES.waitMoves;   // Execute the moves and wait until complete
                    break;

                // Next stage is to move them on the same line towards each other utill they meet
                case 1:
                    initPositions(370,370);

                    // The initPosition (above) puts the prince back on the right side (off screen). However, the last set of moves
                    // in step 0 left him on the left (off screen). So after init, swap the sprite graphcis for
                    // the prince and princess. This is faster and less code then repositioning all the sprites
                    // to keep continuity.
                    var tempSprite = game.player[1].sprite;
                    game.player[1].sprite = game.player[0].sprite;
                    game.player[0].sprite = tempSprite;

                    // Now get them a mvovin'
                    game.player[0].moveTo(245,  e,e,e);
                    game.player[2].moveTo(335,  e,e,e);
                    game.player[3].moveTo(  e, 65,e,e);
                    game.player[1].moveTo(  e,155,e,e);

                    homageState = CONST.SCRIPT.STATES.waitMoves;
                    break;

                // Next stage is to move royals up a row and to move the bugs forward until they meet.
                case 2:
                    game.player[0].moveTo(  e,  e,300,e);
                    game.player[1].moveTo(  e,  e,300,e);
                    game.player[3].moveTo(  e,150,  e,e);
                    game.player[2].moveTo(250,  e,  e,e);

                    homageState = CONST.SCRIPT.STATES.waitMoves;
                    break;

                // Move the royals up screen away from the collided bugs and bounce the bugs away from each other
                case 3:
                    game.player[0].moveTo(  e,  e,150,e);
                    game.player[1].moveTo(  e,  e,150,e);
                    game.player[3].moveTo(100,  e,  e,e);
                    game.player[2].moveTo(  e,300,  e,e);


                    homageState = CONST.SCRIPT.STATES.waitMoves;
                    break;

                // Finish by moving the royals until they meet
                case 4:
                    game.player[0].moveTo(225,  e,e,e);
                    game.player[1].moveTo(  e,180,e,e);

                    homageState = CONST.SCRIPT.STATES.waitMoves;
                    break;

                // kiss me you fool. Enable the heart partical fountain.
                case 5:
                    game.state = CONST.STATES.wonGameEnd;
                    for (var i = 0; i < numHearts; ++i) {
                        hearts.push(new Prticle(1,'images/heart.png'));
                    }

                    // Show the hearts for 10 seconds
                    delayTime = Date.now()+ 10000;               // 10 seconds
                    homageState = CONST.SCRIPT.STATES.pause;     // Delay
                    break;

                // All done.. nothing to see here, go back the the start screen
                case 6:
                    hearts = [];
                    homageState = CONST.SCRIPT.STATES.waitMoves;
                    document.dispatchEvent(new CustomEvent('gamewon'));
                    break;
            }

        break;
    }

};



function initPositions(pY1, pY2) {
    var royal1X=game.player[0].x, royal1Y = game.player[0].y,
        royal2X=game.player[3].x, royal2Y = game.player[3].y;

    royal1X= 510; royal1Y = pY1;
    royal2X=-200; royal2Y = pY2;

    game.player[0].x = royal1X;    game.player[0].y = royal1Y;
    game.player[2].x = royal1X+90; game.player[2].y = royal1Y;
    game.player[3].x = royal2X;    game.player[3].y = royal2Y;
    game.player[1].x = royal2X+90; game.player[1].y = royal2Y;
};


var Prticle = function(pStyle, pValue) {
    this.radius = 5;

    this.style = pStyle;
    this.value = pValue;
    this.x = (CONST.VIEW.width  / 2)-10;
    this.y = (CONST.VIEW.height / 2)-25;
    //this.vx = Math.random() * 2 - 1;
    //this.vy = Math.random() * -10 - 10;
    this.vx = Math.random() * 5 - 1;
    this.vy = Math.random() * -20 - 10;
};


// Update the particles position, reset it if it goes out of bounds then draw it
function draw(pParticle) {
    pParticle.vy += gravity;
    pParticle.x  += pParticle.vx;
    pParticle.y  += pParticle.vy;
    ctx.save();

    // Out of bounds?
    if( pParticle.x - pParticle.radius > CONST.VIEW.width     || pParticle.x + pParticle.radius < 0 ||
        pParticle.y - pParticle.radius > CONST.VIEW.height-30 || pParticle.y + pParticle.radius < 0) {
        pParticle.x = (CONST.VIEW.width  / 2) - 10;
        pParticle.y = (CONST.VIEW.height / 3) - 25;
        pParticle.vx = Math.random() * 5 - 1;
        pParticle.vy = Math.random() * -20 - 10;
    }

    switch (pParticle.style) {
        case 1:
            ctx.drawImage(Resources.get(pParticle.value), pParticle.x-15, pParticle.y, 56, 73);
            //ctx.drawImage(Resources.get(pParticle.value), pParticle.x-15, pParticle.y, rnd(36,56), rnd(53,73));
            break;

        case 2:
            ctx.textAlign = "left";
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillText(pParticle.value, pParticle.x-15, pParticle.y);
            break;
    }
    ctx.restore();
};

