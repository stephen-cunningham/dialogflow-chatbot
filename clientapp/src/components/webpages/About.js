import React from 'react';

const About = () => (
    <div>
        <div style = {{textAlign: 'center'}}>
            <h1>About</h1>
        </div>
        <div style = {{textAlign: 'justify'}}>
            <p>This is a project built for module CT544.</p>
            <p>It is a chatbot that can give information on locations and places.</p>
            <p>It uses the Google Maps Platform APIs to retrieve information requested by the user and return it intelligently.</p>
            <p>It does so by using Google's Natural Language Processing tool, Dialogflow.</p>
            <p>By using this technology, Tyrone has been created to help you with your everyday needs - where to </p>
            <p>For a copy of the project report, contact s.cunningham23@nuigalway.ie</p>
        </div>
    </div>
);

export default About;