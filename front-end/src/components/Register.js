// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    // <BrowserRouter>
      <div>
        <Nav />
        <h1>Register</h1>
        
        <Footer />
      </div>
    /* </BrowserRouter> */
  );
}

export default App;
