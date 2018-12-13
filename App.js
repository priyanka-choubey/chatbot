import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chatbot from './steps.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Chatbot/>
      </div>
    );
  }
}

export default App;
