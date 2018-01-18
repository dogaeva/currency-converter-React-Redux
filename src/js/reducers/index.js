import { CONVERT } from "../constants/action-types";
import axios from 'axios';

var usdPrices, eurPrices = [];
var usdRate, eurRate = {};
var currentRate = '';
var currentValue = '';



axios({
  method:'get',
  url:'https://koronapay.com/exchange/api/currencies/rates',
  responseType:'json'
}).then(function(response) {

  usdPrices = Object.values(response.data["0"].prices);
  usdRate = Object.values(response.data["0"].prices["0"])["0"];
  eurPrices = Object.values(response.data["1"].prices);
  eurRate = Object.values(response.data["1"].prices["0"])["0"];
});



const initialState = {
  inputValue: '0',
  currency: 'usd',
  output: '0',
  rate: '0',
  error: false
};



function getRate (value, prices){
  
  const rangeNumber = prices.length;
  var minVolume, maxVolume;
  currentRate = prices[0].value;

  
  
  for(var i=0;i<rangeNumber;i++){
    
    minVolume = prices[i].minVolume/100;
    maxVolume = prices[i].maxVolume/100;
    
    if ((value>=minVolume)&&(value<=maxVolume)){
      
      currentRate = (currentRate * (1- (0.002 * i))).toFixed(2);

      return;
    }  
    
  }
  return; 
}



const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONVERT:
    
    var value = action.payload.inputValue; //Значение из формы 
    var rateValue, min, max = "";
    var currencyPrices = [];
    var bool = false;

    if (action.payload.currency === 'usd') {

      rateValue = usdRate;
      currencyPrices = usdPrices;

    } else {

      rateValue = eurRate;
      currencyPrices = eurPrices;

    }

    min = currencyPrices["0"].minVolume/100;
    max = currencyPrices["3"].maxVolume/100;

    if ((value>=min)&&(value<=max)) {
     
      getRate(value, currencyPrices);

      rateValue = currentRate;
      currentValue = (currentRate * value).toFixed(0);
      bool = false;

    } else {
      bool = true;
      rateValue = 0;
      currentValue = 0;
    }
    
    if (value === ''){
      bool = false;
    }
 

      {
        return{...state, 
        currency: action.payload.currency, 
        inputValue: action.payload.inputValue,
        rate: rateValue,
        error: bool,
        output: currentValue
         };
      }
      default:
       return state;
   

  }
};



export default rootReducer;