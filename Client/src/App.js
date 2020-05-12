import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import configureStore from './Redux/store';
import HomePage from './containers/Homepage/HomePage';
const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HomePage />
      </Provider>
    );
  }
}

export default App;
