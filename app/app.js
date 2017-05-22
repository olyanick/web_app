import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';

var App = require("./layout/App");
var Register = require("./pages/Register/Register");
var Login = require("./pages/Login/Login");
var Chat = require("./pages/Chat/Chat");
var Files = require("./pages/Files/Files");
var PublicFiles = require("./pages/PublicFiles/PublicFiles");
var Schedule = require("./pages/Schedule/Schedule");
var Profil = require("./pages/Profil/Profil");

render((
  <Router>
    <Route path="/" component={App}>
      <Route path="profil" component={Profil}/>
      <Route path="register" component={Register}/>
      <Route path="login" component={Login}/>
      <Route path="chat" component={Chat}/>
      <Route path="files" component={Files}/>
      <Route path="public_files" component={PublicFiles}/>
      <Route path="schedule" component={Schedule}/>
    </Route>
  </Router>
), document.getElementById('container'));



