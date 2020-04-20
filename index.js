const express = require('express');//this gets the express module
const bodyParser = require('body-parser');//importing body parser helper, which is a body parsing middleware. This helps to read data in requests.

const config = require('./config/keys');
const mongoose = require('mongoose');//this creates a single connection to the database through a singleton
mongoose.connect(config.mongoDBUri, {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();//this creates the app

// require('dotenv').config();
app.use(bodyParser.json());

//this ensures the dialogflowRoutes.js file is required by index.js. The route handling for DialogFlow is done in that file
//passing app means app will be available in the dialogflowRoutes.js file
require('./routes/dialogflowRoutes')(app);
//the route handling for fulfillment is done in this file
require('./routes/fulfillmentRoutes')(app);

//this deals with route handling in production (i.e. Heroku deployment)
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('clientapp/build'));//all javascript and css files are read and served from here
    const path = require('path');
    app.get('*', (req, res) => {//this sends any route (*) that hasn't been handled above to index.html
        /*
        using resolve(): https://nodejs.org/api/path.html#path_path_resolve_paths
        resolve checks whether dealing with absolute path
        in this case, it returns clientapp/build/index.html
        __dirname: https://alligator.io/nodejs/how-to-use__dirname/
         */
        res.sendFile(path.resolve(__dirname, 'clientapp', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;//PORT has a dynamic variable read from the environment variable on Heroku and value 5000 locally
app.listen(PORT);//this tells the app to listen on the define port number