var React = require('react');
var Link = require('react-router').Link;

var AuthActions = require('./../../actions/AuthActions');
var AuthStore = require('./../../stores/AuthStore');

import { History  } from 'react-router';

var Login = React.createClass({
  mixins: [ History ],
  getInitialState: function(){
    return ({user:AuthStore.getData()});
  },
  redirect: function(data){

    this.setState({user:data});

    if(this.state.user && this.state.user.email){
      this.history.pushState(null, '/profil');
    }
  },
  componentWillMount: function(){

    this.unsubscribe = AuthStore.listen(this.redirect);
    //if(this.state.user && this.state.user.email){
    //  this.history.pushState(null, '/profil');
    //}
  },
  componentWillUnmount: function() {
    this.unsubscribe();
  },
  login:function(e){
    e.preventDefault();
    var data = {};
    for(var key in this.refs ){
      data[key]=this.refs[key].value;
    }
    AuthActions.login(data);
  },
  render: function(){

    return (
      <div className="loginPage">
        <form onSubmit={this.login} role="form" >
            <input tabIndex="1"  ref="email" type="email" className="input" id="email" placeholder="Email"/>
            <input tabIndex="2" ref="password" type="password" className="input" id="pwd" placeholder="Password"/>
          <button type="submit" className="button_primary">Вход</button>
        </form>
      </div>

    );
  }
});
module.exports = Login;
