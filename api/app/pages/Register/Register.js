var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;
var AuthActions = require('./../../actions/AuthActions');
var AuthStore = require('./../../stores/AuthStore');
var config = require("../../config");
var Qajax = require('qajax');

var Register = React.createClass({
  mixins:[History],
  componentDidMount: function(){

    this.unsubscribe = AuthStore.listen(this.redirect);
    //if(this.state.user && this.state.user.email){
    //  this.history.pushState(null, '/profil');
    //}
  },
  getInitialState: function(){
    return({passValid:false,
            emailValid: false,
            emailExist:false});
  },
  redirect: function(data){
    if(AuthStore.getData() && AuthStore.getData().email){
      this.history.pushState(null, '/profil');
    }
  },
  componentWillUnmount: function() {
    this.unsubscribe();
  },
  checkPass: function(){
    var pas1 = this.refs["password"].value;
    var pas2 = this.refs["password2"].value;
    if(pas1==pas2){
      this.setState({passValid:true});
    } else {
      this.setState({passValid:false});
    }
  },
  checkEmail: function(){
    var _this = this;
    var reg = /\S+@\S+\.\S+/;
    var email  = this.refs['email'].value;
    var valid = reg.test(email);
    var data = {email:email};
    this.setState({emailValid:valid});
    Qajax({ url: config.urls.checkEmail, method: "POST" ,data})
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then(function(data){
        if(data.exists){
          _this.setState({emailExist:true});
        } else {
          _this.setState({emailExist:false});
        }
      })
      .done();
  },
  register:function(e){
    if(!this.state.passValid || !this.state.emailValid || this.state.emailExist){return}
    e.preventDefault();
    var data = {};
    for(var key in this.refs ){
      data[key]=this.refs[key].value;
    }
    AuthActions.register(data);
  },
  render: function(){

    return (
      <div className="loginPage">
        <form onSubmit={this.register} role="form" method="POST" action="/user" className=" col-md-6 col-md-offset-3">
          <input tabIndex="1" className="input" type="text" ref="name" name="name"  id="fio" placeholder="ФИО"/>
          <p className="validateError" style={{display:this.state.emailExist ? "block":"none"}}>Такой email уже существует</p>
          <p className="validateError" style={{display:this.state.emailValid ? "none":"block"}}>Введенный email не валиден</p>
          <input tabIndex="2" onChange={this.checkEmail} className="input" type="email" ref="email" name="email"  id="email" placeholder="Email" placeholder="Email"/>
          <p className="validateError" style={{display:this.state.passValid ? "none":"block"}}>Пароли не совпадают</p>
          <input tabIndex="3" onChange={this.checkPass} className="input" type="password" ref="password" name="password"   id="pwd" placeholder="Пароль"/>
          <input tabIndex="4" onChange={this.checkPass} className="input" type="password" ref="password2"   id="pwd2" placeholder="Подтверждение пароля"/>
          <button disabled={!this.state.passValid || !this.state.emailValid || this.state.emailExist} type="submit" className="button_primary">Отправить</button>
        </form>
      </div>


    );
  }
});
module.exports = Register;
