class Exception {
    name = 'Excetpion';
    message = 'Deu um erro ai';
    data = {};
    constructor(name, message, data) {
        this.name = `${name}Exception`;
        this.message = message;
        this.data = data;
        this.fileName = (new Error()).fileName;
        this.line = (new Error()).lineNumber;
        this.stack = (new Error()).stack;
    }
}

module.exports = {
    Exception
}