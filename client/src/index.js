import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import Authentication from './Authentication';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom'

// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router basename="/">
		<Route path="/">
	      <Authentication/>
		</Route>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
