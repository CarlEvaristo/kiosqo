import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom"
import { NewsContextProvider } from "./Context"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NewsContextProvider>
      <Router>
          <App/>
      </Router>
    </NewsContextProvider>
  </React.StrictMode>
);


