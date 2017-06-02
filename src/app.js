var Alexa = require('alexa-sdk');

const WELCOME_MESSAGE = 'Welcome to High Low guessing game. You have played 0 times. Would you like to play?';
const START_GAME = "Great! Try saying a number to start the game";
const CLOSE_GAME = "Ok, see you next time!";
const HELP_MESSAGE = 'Attention, please!';

const states = {
    WELCOME: '_WELCOME',
    START: '_START',
    GUESSINGGAME: '_GUESSINGGAME'
};


module.exports.handlers = {
    'LaunchRequest': function() {
        this.handler.state = states.START;
        this.emitWithState('Start');
    },
    'CloseRequest': function() {
        this.emit(':tell', CLOSE_GAME);
        this.handler.state = states.START;
    }
};

module.exports.startHandlers = Alexa.CreateStateHandler(states.START, {
    'Start': function() {
        this.emit(':ask', WELCOME_MESSAGE, HELP_MESSAGE);
    },
    'AMAZON.YesIntent': function () {
        // set number
        this.attributes.numberAnswer = Math.floor(Math.random() * 100);

        this.handler.state = states.GUESSINGGAME;
        this.emitWithState('GuessingGame');
    }
});

module.exports.guessingGameHandlers = Alexa.CreateStateHandler(states.GUESSINGGAME, {
    'AMAZON.YesIntent': function () {
        this.handler.state = states.GUESSINGGAME;
        this.emitWithState('GuessingGame');
    },
    'GuessingGame': function() {
        this.emit(':ask', START_GAME, HELP_MESSAGE);
        this.emitWithState('GuessingGameIntent');
    },
    'GuessingGameIntent': function() {
        var numberGuess = this.event.request.intent.slots.number.value;

        if (numberGuess > this.attributes.numberAnswer) {
            this.emit('TooHigh', numberGuess);
        } else if (numberGuess < this.attributes.numberAnswer) {
            this.emit('TooLow', numberGuess);
        } else if (numberGuess == this.attributes.numberAnswer) {
            this.emit('Correct', numberGuess);
        }


    }
});


module.exports.generalHandlers = {
    'TooHigh': function(numberGuess) {
        this.emit(':ask', `${numberGuess} is too high.`, 'Try saying a smaller number.');
    },
    'TooLow': function(numberGuess) {
        this.emit(':ask', `${numberGuess} is too low.`, 'Try saying a smaller number.');
    },
    'Correct': function(numberGuess) {
        this.emit(':tell', `${numberGuess} is correct.`);
        this.handler.state = states.START;
        this.emitWithState('Start');
    }
};
