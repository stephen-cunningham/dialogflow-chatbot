import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../../Header';
import {isTSAnyKeyword} from '@babel/types';

it("renders without crashing",  ()=>{
    const div = document.createElement("div");
    ReactDOM.render(<Header></Header>, div);
});