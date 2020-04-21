//https://www.npmjs.com/package/dialogflow-fulfillment#Setup_Instructions
const { WebhookClient } = require('dialogflow-fulfillment');
const axios = require('axios');
const config = require('../config/keys');

module.exports = app =>{
    //here, the POST request made by dialogflow is caught
    app.post('/', async(req,res) =>{
        try {
            //Create an instance (https://www.npmjs.com/package/dialogflow-fulfillment#Setup_Instructions)
            const agent = new WebhookClient({request: req, response: res});

            function testHandler(agent) {
                agent.add('Routes response #1');
                agent.add('Routes response #2');
            }

            function findPlaceHandler(agent){
                const place = agent.parameters.place;
                const location = agent.parameters.location;
                return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=
                ${place}%20${location}&inputtype=textquery&fields=formatted_address,name,rating,opening_hours,geometry&key=${config.apiKey}`)
                    .then((result) =>{
                        console.log(result.data);//REMOVE AFTER TESTING
                        let botSpeak = "";
                        if(result.data.status === 'ZERO_RESULTS'){
                            botSpeak += `Sorry. I can't find anything that matches what you're looking for.`;
                        }else{
                            result.data.candidates.map(candObj =>{
                                if(result.data.candidates.indexOf(candObj) == 0){
                                    agent.add(`Here are some places:`);
                                }
                                botSpeak = "";
                                botSpeak += candObj.name + `: ` + candObj.formatted_address + ` || The rating of this place is: ` + candObj.rating;
                                if(candObj.opening_hours !== undefined) {
                                    if (candObj.opening_hours.open_now) {
                                        botSpeak += ' || Currently open for business!';
                                    } else {
                                        botSpeak += ' || Currently closed';
                                    }
                                }else{
                                    botSpeak += ` || There is no available information on opening hours.`;
                                }
                                agent.add(botSpeak);
                            });
                        }
                    });
            }

            let intents = new Map();
            intents.set('Test', testHandler);
            intents.set('Find Place', findPlaceHandler);

            await agent.handleRequest(intents);
        }catch(e){
            console.error(e);
        }
    })
};