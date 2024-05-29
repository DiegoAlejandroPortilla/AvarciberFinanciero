import React from 'react';
import ReactDOM from 'react-dom';
import './indice.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const port = process.env.PORT || 3000;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

