import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import App from './App';
import About from './about'

const rootElement = document.getElementById("root");
ReactDOM.render(
    <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App}/>
        <Route exact path="/about" component={About}/>
    </Switch>
    </BrowserRouter>,
    rootElement
);
reportWebVitals();
