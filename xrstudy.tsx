import React from 'react';
import ReactDOM from 'react-dom/client';
import XRStudyPage from './components/XRStudyPage';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find root element to mount XR study page');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <XRStudyPage />
  </React.StrictMode>,
);
