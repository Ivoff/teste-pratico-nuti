const con = require('../database');
const utils = require('../utils');

class Model {
    constructor() {}

    m_fields_values(m_fields, m_object) {            
        return m_fields.map(function(element){            
            return m_object[element.replace(`${element.split('_')[0]}_`, '')];
        })
    }

    save(m_class, m_object) {        
        const prefix = utils.getPrefix(m_class);        
        const fields = utils.getFields(m_class);        
        
        if (m_object.id === undefined || m_object.id === null) {
            const sql = `INSERT INTO ${prefix}(${fields.join(', ')}) 
            VALUES (${fields.map((element, index) => `$${index+1}`).join(', ')})`;
            
            return con.query(sql, this.m_fields_values(fields, m_object));
        } else {
            const sql = `UPDATE ${prefix} 
            SET ${fields.map(function(element, index){
                return `${element} = $${index+1}`;
            }).join(', ')}
            WHERE ${prefix}_id = ${m_object.id}`;
            
            return con.query(sql, this.m_fields_values(fields, m_object));            
        }
    }

    delete(m_class, m_object) {
        const prefix = utils.getFields(m_class);

        if (m_object.id !== undefined && m_object.id !== null) {
            return con.query(`DELETE FROM ${prefix} WHERE ${prefix}_id = ${m_object.id}`);
        }
    }

    read (m_class, m_object) {
        const prefix = utils.getFields(m_class);
        
        if (m_object.id !== undefined && m_object.id !== null) {
            const { rows } = con.query(`SELECT * FROM ${prefix} WHERE ${prefix}_id = ${m_object.id}`);
            console.log(rows);
        }
    }
}

module.exports = { Model };