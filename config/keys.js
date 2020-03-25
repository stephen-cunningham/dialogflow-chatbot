//this ensures that the right set of keys are loaded based on the NODE environment variable
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./production');
}else{
    module.exports = require('./develop');
}