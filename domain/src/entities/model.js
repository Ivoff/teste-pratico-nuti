const con = require('../database');
const utils = require('../utils');

class Model {
    constructor() {}

    save(m_class, m_object) {        
        const prefix = utils.getPrefix(m_class);        
        const fields = utils.getFields(m_class);        
        
        if (m_object.id === undefined || m_object.id === null) {
            const sql = `INSERT INTO ${prefix}(${fields.join(', ')}) 
            VALUES (${fields.map((element, index) => `$${index+1}`).join(', ')})`;
            
            return con.query(sql, utils.getFieldsValues(fields, m_object));
        } else {
            const sql = `UPDATE ${prefix} 
            SET ${fields.map(function(element, index){
                return `${element} = $${index+1}`;
            }).join(', ')}
            WHERE ${prefix}_id = ${m_object.id}`;
            
            return con.query(sql, utils.getFieldsValues(fields, m_object));            
        }
    }

    async delete(m_class, m_object) {
        const prefix = utils.getPrefix(m_class);

        if (m_object.id !== undefined && m_object.id !== null) {
            try {
                const { rowCount } = await con.query(`DELETE FROM ${prefix} WHERE ${prefix}_id = ${m_object.id}`);
                return rowCount;
            } catch(err) {
                console.trace(err);
            }
        }
    }

    async read (m_class, m_object) {
        const prefix = utils.getPrefix(m_class);
        
        if (m_object.id !== undefined && m_object.id !== null) {
            try {
                const { rows } = await con.query(`SELECT * FROM ${prefix} WHERE ${prefix}_id = ${m_object.id}`);
                utils.rowToObject(m_class, m_object, rows);                
            } catch (err) {
                console.trace(err);
            }            
        }
    }

    async all(m_class, m_object) {
        const prefix = utils.getPrefix(m_class);
        const fields = utils.getFields(m_class);
        try {
            const { rows } = await con.query(`SELECT * FROM ${prefix}`);
            return utils.rowsToArrayOfObjects(m_class, rows);
        } catch(err) {
            console.trace(err);
        }
    }
}

module.exports = { Model };