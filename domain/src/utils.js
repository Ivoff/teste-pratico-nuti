function camelToSnakeCase(name) {
    return name.replace(/[A-Z]/g, (letter) => {
        return `_${letter.toLowerCase()}`;
    })
}

function getPrefix(m_class) {
    return m_class.name.toLowerCase();
}

function getFields(m_class) {    
    const prefix = getPrefix(m_class);    

    let aux = Object.getOwnPropertyNames(new m_class);            
    aux.splice((aux.indexOf('id')), 1);
    
    return aux.map(function(element){
        return `${prefix}_${camelToSnakeCase(element)}`;
    });
}

module.exports = {
    camelToSnakeCase,
    getPrefix,
    getFields
}