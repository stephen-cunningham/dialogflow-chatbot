//https://www.npmjs.com/package/dialogflow-fulfillment#Setup_Instructions
const { WebhookClient } = require('dialogflow-fulfillment');

module.exports = app =>{
    //here, the POST request made by dialogflow is caught
    app.post('/', async(req,res) =>{
        try {
            //Create an instance (https://www.npmjs.com/package/dialogflow-fulfillment#Setup_Instructions)
            const agent = new WebhookClient({request: req, response: res});
            //this is the intent to handle unknown/unrecognised input from the user
            function defaultFallback(agent) {
                agent.add('What was that?');
                agent.add('Sorry, what was that?');
                agent.add('I missed what you said. What was that?');
                agent.add('I didn\'t get that. Can you say it again?');
                agent.add('Sorry, could you say that again?');
            }

            function test(agent) {
                agent.add('Routes response #1');
                agent.add('Routes response #2');
            }
            let intentMap = new Map();
            intentMap.set('Default Fallback Intent', defaultFallback);
            intentMap.set('Test', test);
            await agent.handleRequest(intentMap);
        }catch(e){
            console.error(e);
        }
    })
};