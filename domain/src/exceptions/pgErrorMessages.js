const pgCodeMessages = {
    23503: 'Existem voos que dependem desse registro',
    time_conflict: 'O avião não estará disponível no horário definido',
    locality_conflict: 'O avião não estará fisicamente disponível na cidade definida no horário definido',
    generic_conflict: 'O avião tem conflitos de horário e localidade com outros voos registrados'
}

function pgErrorMessages(errorCode) {
    return (pgCodeMessages[errorCode] === undefined ? 
        'Algo de errado aconteceu... LOL' : 
        pgCodeMessages[errorCode]);
}

module.exports = pgErrorMessages;