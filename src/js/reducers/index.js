import { CONVERT } from "../constants/action-types";
import axios from 'axios';


var usdPrices, eurPrices = [];
var usdRate, eurRate = {};
var status = "";

 
axios({
  method:'get',
  url:'https://koronapay.com/exchange/api/currencies/rates',
  responseType:'json'
}).then(function(response) {
  status = response.status;
  usdPrices = Object.values(response.data["0"].prices);
  usdRate = Object.values(response.data["0"].prices["0"])["0"];
  eurPrices = Object.values(response.data["1"].prices);
  eurRate = Object.values(response.data["1"].prices["0"])["0"];
})
.catch(function(e){
  console.clear();
  console.log(e);
  alert("Response Error"); 
});



const initialState = {
  inputValue: '0',
  currency: 'usd',
  output: '0',
  rate: '0',
  error: false,
  min: "",
  max: "",
};



function getRate (value, prices){
  
  const rangeNumber = prices.length;
  var minVolume, maxVolume;
  var currentRate = prices[0].value;
  
  
  for(var i=0;i<rangeNumber;i++){
    
    minVolume = prices[i].minVolume/100;
    maxVolume = prices[i].maxVolume/100;
    
    if ((value>=minVolume)&&(value<=maxVolume)){
      
      currentRate = (currentRate * (1- (0.002 * i))).toFixed(2);

      return currentRate;
    }  
    
  }

  return currentRate; 
}



const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONVERT:
    
    if (status !== 200){
      return state;
    }
    
   // console.log(action.payload.error);
    if (action.payload.error === true){
      
      return {
        ...state,
        error: true
      }
    } 

    var value = action.payload.inputValue;  
    var currentValue, rateValue, min, max = "";
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

      rateValue =  getRate(value, currencyPrices);
      currentValue = (rateValue * value).toFixed(0);
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
        output: currentValue,
        min: min,
        max: max
         };
      }
      default:
       return state;
   

  }
};



export default rootReducer;