const WELCOME_MESSAGE = 'Hello Roooooob!';

module.exports.handlers = {
    LaunchRequest() {
        this.emit(':tell', WELCOME_MESSAGE);
    }
};
