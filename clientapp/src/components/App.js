import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Home from "./webpages/Home";
import About from "./webpages/About";
import Header from "./Header";

const Application = () =>(
    <div>
        <BrowserRouter>
            <div className="container">
                <Header/>
                <Route exact path = "/" component = {Home}/>
                <Route exact path = "/about" component = {About}/>
            </div>
        </BrowserRouter>
    </div>
);

export default Application;