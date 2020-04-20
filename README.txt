../bot
    /bot.js
        this is the module for the chatbot. This contains all the chatbot code handles all the actions for the chatbot.
    /structJson.js
        A 'struct' (https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/Struct.html) represents a structured data value.
        In javascript, a struct is represented by an object. The JSON representation for struct is a JSON object.
        This file allows for JavaScript objects to be converted to structs.

../config
    /keys.js
        this ensures that the right keys are used and instructs the application to load either develop.js or production.js as the configuration file
    /develop.js
        this contains the keys for local development
    /production.js
        this is for Heroku

../routes
    this deals with all route handling
    /dialogflowRoutes.js

../index.js

../package.json

../clientapp
    user to create: https://github.com/facebook/create-react-app
    this is the react app
    /src
        /components
        this is where all React components are. These are independent, reusable bits of code: https://www.w3schools.com/react/react_components.aspe