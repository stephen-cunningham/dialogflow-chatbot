//source: https://github.com/chimurai/http-proxy-middleware
const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app){
    //with this, every request to the api is redirected to the backend app
    app.use(createProxyMiddleware('/api/', {target: 'http://localhost:5000'}));
};

// const proxy = require('http-proxy-middleware');
// module.exports = (app) => {
//     app.use(proxy('/api/*', { target: 'http://localhost:5000'}));
// }