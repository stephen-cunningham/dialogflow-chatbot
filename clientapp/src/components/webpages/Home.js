import React from 'react';
import Bot from "../bot/Bot";

const Home = () => (
    <div>
        <div style = {{textAlign: 'center'}}>
            <h1>Home</h1>
        </div>
        <div>
            <Bot/>
        </div>
    </div>
);

export default Home;