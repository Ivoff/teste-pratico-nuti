const { Exception } = require('../exceptions/exceptions');
const utils = require('../utils');
const pgErrorMessages = require('../exceptions/pgErrorMessages');

class Controller {
    actions = [
        {
            create: { verb: 'post', params: [] }
        },
        {
            update: { verb: 'post', params: [] }
        },
        {
            read: { verb: 'get', params: [':id'] }
        },
        {
            delete: { verb: 'get', params: [':id'] }
        }
    ];

    constructor(m_class) {
        try {
            if (utils.isModelInherited(m_class)) {
                this.model = m_class
                this.route = m_class.name.toLowerCase();
            } else {
                throw new Exception('Controller', 'Class passed in constructor is not a Model inherited class');
            }
        } catch(e) {
            console.trace(e);
            return;
        }
    }

    async save(req, res) {
        let m_object = new this.model(req.body);
        try {
            const result = await m_object.save();
            if (result.status) {
                res.json(result);
            } else {
                res.json({
                    status: result.status,
                    message: pgErrorMessages(result.errorCode),
                    data: result.data
                })
            }

        } catch(e) {
            const error = new Exception('Controller', `Method create from route ${this.route} deu pau`);
            console.trace(error);            
        }
    }

    async create(req, res) {
        await this.save(req, res);
    }

    async update(req, res) {
        await this.save(req, res);
    }

    async delete(req, res) {        
        let m_object = new this.model();
        m_object.id = req.params.id;        
        const result = await m_object.delete();
        
        if (result.status) {
            res.json(result)
        } else {
            res.json({
                status: result.status,
                message: pgErrorMessages(result.errorCode)
            });
        }        
    }

    async read(req, res) {
        let m_object = new this.model();
        m_object.id = req.params.id;
        await m_object.read();        
        res.json({
            status: true,
            data: m_object
        });        
    }

    async all(req, res) {
        let m_object = new this.model();
        const result = m_object.all();        
        res.json({
            status: true,
            data: result
        });        
    }
}

module.exports = Controller;