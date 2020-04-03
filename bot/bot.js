'use strict';
//https://github.com/googleapis/nodejs-dialogflow
const dialogFlow = require('dialogflow');
const structJson = require('./structJson');

const config = require('../config/keys');

//getting the config vars from Heroku
const projectID = config.googleProjectID;
const sessionID = config.dialogFlowSessionID;
const clientEmail = config.googleClientEmail;
//idea for .replace(): https://github.com/auth0/node-jsonwebtoken/issues/642
const privateKey = config.googlePrivateKey;
const languageCode = config.dialogFlowSessionLanguageCode;

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

module.exports = {
    textQuery: async function(text, parameters = {}, uniqueId){//parameters is an empty object by default
        try{
            //sessionID comes from the config file and uniqueId comes from the client
            let sessionPath = sessionClient.sessionPath(projectID, sessionID + uniqueId);//create the sessions path
            let self = module.exports;//accessing another module exports method
            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: text,// The query to send to the dialogflow agent
                        languageCode: languageCode,// The language used by the client
                    },
                },
                //this sends parameters along with a text query
                queryParams: {
                    payload: {
                        data: parameters//data becomes an object based on the parameters passed to the function by the client
                    }
                }
            };
            //using asynchronous promises
            //https://www.youtube.com/watch?v=r_X-PLoz1lE
            //https://javascript.info/async-await
            let responses = await sessionClient.detectIntent(request);//await returns a promise
            responses = await self.handleAction(responses);
            return responses;
        }catch (e){
            console.error(e);
        };
    },

    eventQuery: async function(event, parameters, uniqueId){//parameters is an empty object by default
        try {
            let sessionPath = sessionClient.sessionPath(projectID, sessionID + uniqueId);//create the sessions path
            let self = module.exports;//accessing another module exports method
            const request = {
                session: sessionPath,
                queryInput: {
                    event: {
                        name: event,// The query to send to the dialogflow agent
                        parameters: structJson.jsonToStructProto(parameters),//here, a JSON object (parameters) is passed to the method and converted to struct
                        languageCode: languageCode,// The language used by the client (en-IE)
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
        }catch(e){
            console.error(e);
        };
    },

    handleAction: function(responses){
        return responses;
    }
};