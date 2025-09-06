// Placeholder para o arquivo principal do frontend
import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  return (
    <div>
      <h1>NIOE Frontend</h1>
      <p>Frontend em desenvolvimento...</p>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
