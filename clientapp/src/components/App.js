import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Home from "./webpages/Home";
import About from "./webpages/About";
import Header from "./Header";
import Bot from "./bot/Bot";

const Application = () =>(
    <div>
        <BrowserRouter>
            <div className="container">
                <Header/>
                <Route exact path = "/" component = {Home}/>
                <Route exact path = "/about" component = {About}/>
                <Bot/>
            </div>
        </BrowserRouter>
    </div>
);

export default Application;