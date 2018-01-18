import React from "react";
import { connect } from "react-redux";


const mapStateToProps = state => {
  return { rate: state.rate, output: state.output};
};


const PaymentBlock = ({ rate, output }) => (
  <div className="row">
   <div className="col-md-3">
    <h3>Курс</h3>
    <h2 className="display-4">
      {rate}
    </h2>
   </div>

  <div className="col-md-7 offset-md-1">
   <h3>К оплате</h3>
    <h2 className="display-4">
      {output} ₽
    </h2>
  </div>
  
  </div>
);




const Payment = connect(mapStateToProps)(PaymentBlock);

export default Payment;