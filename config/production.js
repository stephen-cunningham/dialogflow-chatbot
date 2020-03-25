//https://www.npmjs.com/package/dialogflow
// all required configuration keys will be stored here
module.exports = {
    //these values are set in the Heroku config vars in order to protect the actual values for security reasons
    googleProjectID: process.env.GOOGLE_PROJECT_ID,
    dialogFlowSessionID: process.env.DF_SESSION_ID,
    dialogFlowSessionLanguageCode: process.env.DF_SESSION_LANG_CODE,
    googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY
};