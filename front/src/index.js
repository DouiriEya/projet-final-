import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import store from './Redux/Store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <Router> {/* Wrap App with Router */}
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
