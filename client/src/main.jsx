// index.jsx or main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ✅ This is key
import { Provider } from 'react-redux';
import { store } from './app/store'; // adjust path as needed
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* ✅ Wrap with BrowserRouter only here */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
