function camelToSnakeCase(name) {
    return name.replace(/[A-Z]/g, (letter) => {
        return `_${letter.toLowerCase()}`;
    })
}

function getPrefix(m_class) {
    return m_class.name.toLowerCase();
}

function getFields(m_class, with_id) {    
    const prefix = getPrefix(m_class);    

    let aux = Object.getOwnPropertyNames(new m_class);            

    with_id = with_id ?? false;
    if (!with_id)
        aux.splice((aux.indexOf('id')), 1);
    
    return aux.map(function(element){
        return `${prefix}_${camelToSnakeCase(element)}`;
    });
}

function getFieldsValues(m_fields, m_object) {
    return m_fields.map(function(element) {
        const aux = m_object[element.replace(`${element.split('_')[0]}_`, '')];
        if (Object.getPrototypeOf((aux).constructor).name === 'Model') {
            return aux.id
        }
        return aux;
    })
}

function isModelInherited(m_class) {
    if (typeof m_class !== 'function')
        return false;
    return Object.getPrototypeOf((new m_class).constructor).name === 'Model';            
}

function rowToObject(m_class, m_object, m_rows) {
    const prefix = getPrefix(m_class);
    const fields = getFields(m_class);

    fields.forEach((element) => {
        m_object[element.replace(`${prefix}_`, '')] = m_rows[0][element];
    });            
}

function rowsToArrayOfObjects(m_class, m_rows) {
    const prefix = getPrefix(m_class);
    const fields = getFields(m_class, true);        
    let collection = [];    
    if (m_rows !== null && m_rows !== undefined) {
        collection = m_rows.map((row) => {
            let aux = new m_class();
            fields.forEach((element) => {
                aux[element.replace(`${prefix}_`, '')] = row[element];
            });
            return aux;
        });
    }            
    return collection;    
}

module.exports = {
    rowsToArrayOfObjects,
    camelToSnakeCase,
    isModelInherited,
    getFieldsValues,    
    rowToObject,
    getPrefix,
    getFields  
}