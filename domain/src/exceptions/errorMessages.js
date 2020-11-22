const codeMessages = {
    save: {
        23503: 'Avião ou cidades não existem na base de dados',    
        time_conflict: 'O avião não estará disponível no horário definido',
        locality_conflict: 'O avião não estará fisicamente disponível na cidade definida no horário definido'    
    },
    delete: {
        23503: 'Existem voos que dependem desse registro',    
    },
    all: {
        req_attribute_mismatch: 'Algum(s) Atributo(s) do objeto sao invalidos'
    },
    default: "Algo de errado aconteceu... "
}

function errorMessages(errorCode, action) {      
    if (codeMessages[action] == undefined || codeMessages[action] == null) {
        return codeMessages['default'];            
    } else {
        return codeMessages[action][errorCode] ?? codeMessages['default'];
    }    
}

module.exports = errorMessages;