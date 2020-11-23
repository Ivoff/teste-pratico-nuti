const con = require('../database/database');
const { Exception } = require('../exceptions/exceptions');
const utils = require('../misc/utils');

class Model {
    constructor() {}

    async save(m_class, m_object) {
        const prefix = utils.getPrefix(m_class);
        const fields = utils.getFields(m_class);        
        
        try {
            if (m_object.id === undefined || m_object.id === null) {
                const sql = `INSERT INTO ${prefix}(${fields.join(', ')}) 
                VALUES (${fields.map((element, index) => `$${index+1}`).join(', ')})`;
    
                const { rowCount } = await con.query(sql, utils.getFieldsValues(fields, m_object));
                return {status: true, rowCount: rowCount};
    
            } else {
                const sql = `UPDATE ${prefix} 
                SET ${fields.map(function(element, index){
                    return `${element} = $${index+1}`;
                }).join(', ')}
                WHERE ${prefix}_id = ${m_object.id}`;
                
                const { rowCount } = await con.query(sql, utils.getFieldsValues(fields, m_object));
                return {status: true, rowCount: rowCount};
            }
        } catch (err) {
            console.trace(err);
            return {status: false, errorCode: err.code};
        }        
    }

    async delete(m_class, m_object) {
        const prefix = utils.getPrefix(m_class);

        if (m_object.id !== undefined && m_object.id !== null) {
            try {
                const { rowCount } = await con.query(`DELETE FROM ${prefix} WHERE ${prefix}_id = $1`, [m_object.id]);
                return {status: true, rowCount: rowCount};
            } catch(err) {
                console.trace(err);
                return {status: false, errorCode: error.code};
            }
        }
    }

    async read (m_class, m_object) {
        const prefix = utils.getPrefix(m_class);
        
        if (m_object.id !== undefined && m_object.id !== null) {
            try {
                const { rows } = await con.query(`SELECT * FROM ${prefix} WHERE ${prefix}_id = $1`, [m_object.id]);
                utils.rowToObject(m_class, m_object, rows);
            } catch (err) {
                console.trace(err);
                throw {status:false, errorCode: err.code};
            }            
        }
    }

    async all(m_class, m_object) {
        const prefix = utils.getPrefix(m_class);
        const fields = utils.getFields(m_class);        
        
        try {
            if (utils.isObjEmpty(m_object)) {
                const { rows } = await con.query(`SELECT * FROM ${prefix} ORDER BY ${prefix}_id ASC`);                            
                return utils.rowsToArrayOfObjects(m_class, rows);

            } else {                            
                let values = [];                
                const statements = fields.map((element, index) => {                    
                    const key = element.replace(`${prefix}_`, '');                                
                    
                    if (m_object[key]) {                  
                        values.push(m_object[key]);
                        return `${element} = $${index+1}`;
                    }                    
                    return null;

                }).filter(element => element !== null);                
                
                if (!values.length || !statements.length || (values.length !== statements.length)) {
                    throw { code: 'req_attribute_mismatch' };
                }                     
                const { rows } = await con.query(`
                SELECT * 
                FROM ${prefix} 
                WHERE
                    ${statements.join(' AND ')}
                ORDER BY ${prefix}_id ASC`, values);
                return utils.rowsToArrayOfObjects(m_class, rows);
            }         
        } catch(err) {
            console.trace(err);
            throw {status:false, errorCode: err.code};
        }
    }
}

module.exports = Model;