const express = require('express');//this gets the express module
const bodyParse = require('body-parser');//importing body parser helper, which is a body parsing middleware. This helps to read data in requests.
const app = express();//this creates the app

app.use(bodyParse.json());

//this ensures the dialogFlowRoutes.js file is required by index.js. The route handling for DialogFlow is done in that file
//passing app means app will be available in the dialogFlowRoutes.js file
require('./routes/dialogFlowRoutes')(app);

const PORT = process.env.PORT || 5000;//PORT has a dynamic variable read from the environment variable on Heroku and value 5000 locally
console.log('Port is: ' + PORT);
app.listen(PORT);//this tells the app to listen on the define port number