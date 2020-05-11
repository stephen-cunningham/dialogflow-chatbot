//https://www.npmjs.com/package/dialogflow-fulfillment#Setup_Instructions
const { WebhookClient } = require('dialogflow-fulfillment');
const axios = require('axios');
const config = require('../config/keys');

module.exports = app =>{
    /**
     * here, the POST request made by dialogflow is caught
     */
    app.post('/', async(req,res) =>{
        try {
            //Create an instance (https://www.npmjs.com/package/dialogflow-fulfillment#Setup_Instructions)
            const agent = new WebhookClient({request: req, response: res});

            /**
             * the Find Place intent handler
             */
            function findPlaceHandler(agent){
                const place = agent.parameters.place;//taking the place name from user input
                const location = agent.parameters.location;//taking the location from user input
                //GET request to the API for the data
                return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=
                ${place}%20${location}&inputtype=textquery&fields=formatted_address,name,rating,opening_hours,geometry,place_id&key=${config.apiKey}`)
                    .then((result) =>{//this runs after the GET request is returned
                        console.log(result.data);//REMOVE AFTER TESTING
                        let botSpeak = "";//what the bot will responds with
                        botSpeak += "Let me look into it";
                        agent.add(botSpeak);//sending this to the user
                        if(result.data.status === 'ZERO_RESULTS'){//if the API call returns no results
                            botSpeak = "";
                            botSpeak += `Sorry. I can't find anything that matches what you're looking for.`;
                            agent.add(botSpeak);
                        }else{//if results are returned
                            result.data.candidates.map(candObj =>{//mapping each 'candidates' object
                                botSpeak = "";
                                let found = false;
                                for(let i=0; i<result.data.candidates.length; i++){//checking if the name from user matches name from results
                                    if(result.data.candidates[i].name == candObj.name){
                                        found = true;
                                    }
                                }
                                if(found == false){
                                    botSpeak += "I can't find what you're looking for in " + agent.parameters.location;
                                    agent.add(botSpeak);
                                    botSpeak = "";
                                    agent.add(`Here are some alternatives:`);
                                }else{
                                    if(result.data.candidates.indexOf(candObj) == 0) {
                                        agent.add(`Here is what you are looking for:`)
                                    }
                                    botSpeak += candObj.name + `: ` + candObj.formatted_address;
                                    if(candObj.rating != "0"){
                                        botSpeak +=  ` || The rating of this place is: ` + candObj.rating + "/5";
                                    }
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
                                }
                            });
                        }
                    });
            }

            /**
             * The Where Open intent handler
             */
            function whereOpenHandler(agent){
                const place = agent.parameters.place;//taking the place name from user input
                const location = agent.parameters.location;//taking the location from user input
                const hours = agent.parameters.hours;
                //GET request to the API for the data
                return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=
                ${place}%20${location}&inputtype=textquery&fields=formatted_address,name,opening_hours,geometry&key=${config.apiKey}`)
                    .then((result) =>{//this runs after the GET request is returned
                        console.log(result.data);//REMOVE AFTER TESTING
                        let botSpeak = "";//what the bot will responds with
                        botSpeak += "Let me look into it";
                        agent.add(botSpeak);//sending this to the user
                        if(result.data.status === 'ZERO_RESULTS'){//if the API call returns no results
                            botSpeak = "";
                            botSpeak += `Sorry. I can't find anything that matches what you're looking for.`;
                            agent.add(botSpeak);
                        }else{//if results are returned
                            result.data.candidates.map(candObj =>{//mapping each 'candidates' object
                                botSpeak = "";
                                let found = false;
                                for(let i=0; i<result.data.candidates.length; i++){//checking if the name from user matches name from results
                                        if(result.data.candidates[i].name == candObj.name){
                                        found = true;
                                    }
                                }
                                if(found == false){
                                    botSpeak += "I can't find what you're looking for in " + agent.parameters.location;
                                    agent.add(botSpeak);
                                    botSpeak = "";
                                    // agent.add(`Here are some alternatives:`);
                                }else{
                                    if(result.data.candidates.indexOf(candObj) == 0) {
                                        agent.add(`Here is what you are looking for:`)
                                    }
                                    botSpeak += candObj.name + `: ` + candObj.formatted_address;
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
                                }
                            });
                        }
                    });
            }

            /**
             * 'Opening Hours' intent handler
             */
            function openingHoursHandler(agent){
                const place = agent.parameters.place;//taking the place name from user input
                const location = agent.parameters.location;//taking the location from user input
                //GET request to the API for the data
                //first, get place_id
                return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=
                ${place}%20${location}&inputtype=textquery&key=${config.apiKey}`)
                    //then get opening hours
                    .then((result) => {//this runs after the GET request is returned
                        if(result.data.status != "ZERO_RESULTS") {
                            return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.data.candidates[0].place_id}&fields=opening_hours,name,formatted_address,formatted_phone_number&key=${config.apiKey}`)
                                //then use the result to do offer the user information
                                .then((result) => {
                                    console.log(result.data.result);
                                    if (result.data.result.opening_hours != undefined) {
                                        agent.add("Here are the opening hours for " + result.data.result.name + ": " + result.data.result.formatted_address);
                                        agent.add(result.data.result.opening_hours.weekday_text);
                                    } else {
                                        agent.add("Opening hours are not available for " + result.data.result.name + ": " + result.data.result.formatted_address);
                                        agent.add("Here is the phone number if you want to contact them directly: " + result.data.result.formatted_phone_number);
                                    }
                                })
                        }else{
                            agent.add(`There are no results for your ${place}: ${location}`);
                        }
                    });
            }

            let intents = new Map();
            // intents.set('Test', testHandler);
            intents.set('Find Place', findPlaceHandler);
            intents.set('Where Open', whereOpenHandler);
            intents.set('Opening Hours', openingHoursHandler);

            await agent.handleRequest(intents);
        }catch(e){
            console.error(e);
        }
    })
};