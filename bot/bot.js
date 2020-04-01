'use strict';
//https://github.com/googleapis/nodejs-dialogflow
const dialogFlow = require('dialogflow');
const structJson = require('./structJson');

// const config = require('../config/production');//CHANGED THIS FROM KEYS FOR TESTING
// const projectID = config.googleProjectID;
// const sessionID = config.dialogFlowSessionID;
// const clientEmail = config.googleClientEmail;
// const privateKey = config.googlePrivateKey;
// const languageCode = config.dialogFlowSessionLanguageCode;
const projectID = process.env.GOOGLE_PROJECT_ID;
const sessionID = process.env.DIALOGFLOW_SESSION_ID;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n');
const languageCode = process.env.DIALOGFLOW_LANGUAGE_CODE;
console.log(languageCode);
// console.log(privateKey);
const credentials = {
    client_email: clientEmail,
    private_key: privateKey
};

/*
initialising session client
passing in the credentials in this fashion ensures that we don't have to set the Google application credentials in your local machine during development
it also enhances the safety of the configuration in the server since all configuration is in environment variables, rather than the files
 */
const sessionClient = new dialogFlow.SessionsClient({projectID, credentials});
const sessionPath = sessionClient.sessionPath(projectID, sessionID);//create the sessions path
// console.log(config.googleProjectID + " || " + config.dialogFlowSessionID + config.googlePrivateKey + config.googleClientEmail + config.dialogFlowSessionLanguageCode);

module.exports = {

    textQuery: async function(text, parameters = {}){//parameters is an empty object by default
        try{// console.log(config.googleProjectID + " || " + config.dialogFlowSessionID + config.googlePrivateKey + config.googleClientEmail + config.dialogFlowSessionLanguageCode);
            console.log('a');
            let self = module.exports;//accessing another module exports method
            console.log('b');
            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: text,// The query to send to the dialogflow agent
                        languageCode: languageCode,// The language used by the client (en-IE)
                    },
                },
                //this sends parameters along with a text query
                queryParams: {
                    payload: {
                        data: parameters//data becomes an object based on the parameters passed to the function by the client
                    }
                }
            };
            console.log('c');
            //using asynchronous promises
            //https://www.youtube.com/watch?v=r_X-PLoz1lE
            //https://javascript.info/async-await
            let responses = await sessionClient.detectIntent(request);//await returns a promise
            console.log('d');
            responses = await self.handleAction(responses);
            console.log('e');
            return responses;
            console.log('f');
        }catch (e){
            console.error(e);
        };
    },

    eventQuery: async function(event, parameters){//parameters is an empty object by default
        let self = module.exports;//accessing another module exports method
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,// The query to send to the dialogflow agent
                    parameters: structJson.jsonToStructProto(parameters),//here, a JSON object (paramenters) is passed to the method and converted to struct
                    languageCode: langaugeCode,// The language used by the client (en-IE)
                },
            },
            //no need for query parameters since parameters are passed in the event object
        };
        //using asynchronous promises
        //https://www.youtube.com/watch?v=r_X-PLoz1lE
        //https://javascript.info/async-await
        let responses = await sessionClient.detectIntent(request);//await returns a promise
        responses = await self.handleAction(responses);
        return responses;
    },

    handleAction: function(responses){
        return responses;
    }
};