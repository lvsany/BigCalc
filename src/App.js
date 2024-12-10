// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './sign-in/SignIn'; 
import MainPage from './main-page/MainPage';
import SignUp from './sign-up/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} /> 
        <Route path="/sign-in" element={<SignIn />} /> 
        <Route path="/sign-up" element={<SignUp />} /> 
      </Routes>
    </Router>
  );
}

export default App;
