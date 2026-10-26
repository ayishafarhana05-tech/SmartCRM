import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CRMProvider } from './context/CRMContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <CRMProvider>
        <App />
      </CRMProvider>
    </ToastProvider>
  </React.StrictMode>
);
