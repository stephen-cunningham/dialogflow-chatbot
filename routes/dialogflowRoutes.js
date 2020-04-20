const bot = require('../bot/bot');

//module is a variable that represents the current module. exports is an object that is exposed as a module. An app is passed to this.
module.exports = app => {
    //this is the handler for the GET request on the home page - no need for it though. Uncomment if you would like
    // app.get('/', (req, res) => {
    //     res.send({'testing': 'GET request'});//sends JSON response
    // });

    //this is the handler for POST requests for text queries
    app.post('/api/df_text_query', async(req, res) => {
        let responses = await bot.textQuery(req.body.text, req.body.parameters, req.body.uniqueId);
        res.send(responses[0].queryResult);
    });

    app.post('/api/df_event_query', async(req, res) => {//this is the handler for POST requests for event queries
        let responses = await bot.eventQuery(req.body.event, req.body.parameters, req.body.uniqueId);
        res.send(responses[0].queryResult);
    });
};