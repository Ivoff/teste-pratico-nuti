const pgCodeMessages = {
    save: {
        23503: 'Avião ou cidades não existem na base de dados',    
        time_conflict: 'O avião não estará disponível no horário definido',
        locality_conflict: 'O avião não estará fisicamente disponível na cidade definida no horário definido'    
    },
    delete: {
        23503: 'Existem voos que dependem desse registro',    
    }
}

function pgErrorMessages(action, errorCode) {
    return (pgCodeMessages[action][errorCode] === undefined ? 
        'Algo de errado aconteceu... LOL' : 
        pgCodeMessages[action][errorCode]);
}

module.exports = pgErrorMessages;