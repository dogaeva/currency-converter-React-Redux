import React from "react";
import Payment from "./Payment";
import Form from "./Form";
import "./App.css"



const App = () => (
  <div className="row mt-7 b-main">
    <div className="col-md-3 offset-md-1">
      <Form />
  </div>
    <div className="col-md-6  offset-md-1">
      <Payment />
    </div> 
  </div>
);


export default App;