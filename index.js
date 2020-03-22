const express = require('express');//this gets the express module
const app = express();//this creates the app

//route handling
app.get('/', (req, res) => {//this is the handler for the GET request on the home page
    res.send({'testing': 'GET request'});//sends JSON response
});

const PORT = process.env.PORT || 5000;//PORT has a dynamic variable read from the environment variable on Heroku and value 5000 locally
app.listen(PORT);//this tells the app to listen on the define port number