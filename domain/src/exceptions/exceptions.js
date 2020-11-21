class Exception {
    name = 'Excetpion';
    message = 'Deu um erro ai';

    constructor(name, message) {
        this.name = `${name}Exception`;
        this.message = message;
        this.fileName = (new Error()).fileName;
        this.line = (new Error()).lineNumber;
        this.stack = (new Error()).stack;
    }
}

module.exports = {
    Exception
}