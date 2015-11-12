
// All the Pseudo constants are collected here
var CONST = new function(){
    this.STATES = {
        run: 0,
        collisionStart: 1,
        collisionEnd: 2,
        outOfTimeStart: 3,
        outOfTimeEnd: 4,
        newLevelStart: 5,
        newLevelEnd: 6,
        startKiss: 7,
        endKiss: 8,
        gameOverStart: 9,
        gameOverEnd: 10,
        wonGameStart: 11,
        wonGameEnd: 12,
        beginGameStart: 13,
        beginGameEnd: 14
    };

    this.VIEW = {
        width: 505,
        height: 535+50,
        waterRow: 15,
        alertFast: 3,
        alertSlow: 2
    };

    this.ROYAL = {
        DEFAULT: {
            moveSpeed: 3,
            x:   0,
            y: -30,
            w: 100,
            h:  83
        }
    };

    this.GENDER = {
        boy: 0,
        girl: 1,
    };

    this.PLAYER = {
        DEFAULT: {
            moveSpeed: 7,
            x: this.VIEW.width / 2 - 50,
            y: this.VIEW.height / 2 + 87,
            w: 100,
            h: 100
        },
        MASK: {
            x: 100,
            y: 83
        }
    };

    this.SCRIPT = {
        STATES: {
            waitMoves: 0,
            run: 1,
            pause: 2
        }
    };

    this.ENEMY = {
        DEFAULT: {
           x: -100,
           streetRows: [15+25, 100+25, 180+25],
           sprites: ['images/char-cat-girl.png',
                     'images/char-horn-girl.png',
                     'images/char-pink-girl.png']
        },
        MASK: {
            width: 70,
            height: 70
        }
    };
};

