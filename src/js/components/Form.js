import React, { Component } from "react";
import { connect } from "react-redux";
import { convertCurrency } from "../actions/index";
import PropTypes from 'prop-types';




const mapStateToProps = state => {
  return { error: state.error, min: state.min, max: state.max };
};


function validate(value, min, max) {
  var regexp = /^\d+$/;
  var flag = false;
  var errorMessage = "";
    console.log(min, max);
  
  if (value.match(regexp)||(value === "")){
   if ((value<min)||(value>max)){
    errorMessage = "Сумма перевода вне диапазона";
    flag = false;
  } else {
    flag = true;
  }
  } else {
    //console.log(errorMessage);
    flag = false;
    errorMessage = "Некоректные данные"
   }
   console.log(flag);
 // console.log(errorMessage);
  return {
    value: flag,
    message: errorMessage
  };
}


const mapDispatchToProps = dispatch => {
  return {
    convertCurrency: input => dispatch(convertCurrency(input))
  };
};



class ConnectedForm extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      condition: false,
      error: false,
      message: "",
      currency: "usd",
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
   
  }


  handleChange(event) {

    this.setState({ [event.target.id]: event.target.value });
    var flag = validate(event.target.value, this.props.min, this.props.max);
   console.log(this.props.min);
   /*
    if (flag.value){ 
      this.setState({ error: false });
      
      const { title } = this.state;
      this.props.convertCurrency({inputValue: event.target.value, currency: this.state.currency, error: this.state.error});
    }else {
       this.setState({ error: true });
       this.setState({ message: flag.message });
       this.props.convertCurrency({error: this.state.error});
       event.preventDefault();
       return;
     }
*/
    const { title } = this.state;
    this.setState({ error: (!flag.value) });
    this.setState({ message: flag.message });
    this.props.convertCurrency({inputValue: event.target.value, currency: this.state.currency, error: (!flag.value)});
    
    // console.log(flag.value);
    
    event.preventDefault();
  }


  handleClick(event) {
    this.setState({
        condition: !this.state.condition,
        currency: event.target.id
      });

    this.props.convertCurrency({inputValue: this.state.title, currency: event.target.id, error: this.state.error});

    event.preventDefault();
  
  }



  render() {
    const { title } = this.state;
    return ( 
     <form >
       <h3 >Выберите валюту</h3>
       <div className="btn-group b-buttons" data-toggle="buttons" >
           <label id="usd" className={this.state.condition ? "btn btn-primary btn-lg" : "btn btn-primary btn-lg active" } onClick={this.handleClick}>
            <input type="radio" name="options" id="usd" autoComplete="off"  value="usd" />USD
           </label>
           <label id="eur" className={this.state.condition ? "btn btn-primary btn-lg  active" : "btn btn-primary btn-lg" } onClick={this.handleClick}>
            <input type="radio" name="options" id="eur" autoComplete="off"  value="eur"  />EUR
           </label>
       </div>

        <h3>Введите сумму</h3>
        <div className="form-group">
          <input type="text" className="form-control" id="title" value={title} onChange={this.handleChange}/>
          <p className={this.state.error ? "help-inline error" : "help-inline d-none"}>{this.state.message}</p>
          <p className={this.state.outOfRangeError ? "help-inline error" : "help-inline d-none"}>Некорректная сумма</p>
        </div>
      </form>
    );
  }
}


const Form = connect(mapStateToProps, mapDispatchToProps)(ConnectedForm);


export default Form;