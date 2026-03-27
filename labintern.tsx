import React from 'react';
import ReactDOM from 'react-dom/client';
import InternPlannerModal from './components/InternPlannerModal';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find root element to mount LabIntern');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <InternPlannerModal
      isOpen={true}
      onClose={() => {
        window.location.href = './';
      }}
    />
  </React.StrictMode>,
);
