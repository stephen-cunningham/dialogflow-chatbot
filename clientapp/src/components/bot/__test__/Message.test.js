import React from 'react';
import ReactDOM from 'react-dom';
import Message from './../Message';
import {isTSAnyKeyword} from '@babel/types';

it("renders without crashing",  ()=>{
    const div = document.createElement("div");
    ReactDOM.render(<Message></Message>, div);
});