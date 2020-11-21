const routes = require('./routes');
const router = require('express').Router();

class Router {

    constructor(app) {
        this.app = app;
        routes.forEach((element) => {                       
            const route = Object.keys(element)[0];
            const controller = element[route];            
            this.generateRoutes(router, route, controller);
        }); 
        this.app.use('/', router);
    }

    generateRoutes(m_router, m_route, m_controller) {        
        m_controller.actions.forEach(function(element) {
            const method = Object.keys(element)[0];
            const verb = element[method].verb;
            const params = (
                element[method].params === undefined || 
                element[method].params === null) ? 
                    '' : 
                    `/${element[method].params.join('/')}`;
            
            const url = `/${m_route}/${method}${params}`;            
            
            m_router[verb](url, function(req, res) {                
                let controller = new m_controller();
                controller[method](req, res);
            });
        });
    }        
}

module.exports = Router;
