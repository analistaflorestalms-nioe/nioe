import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    color: #ffffff;
    min-height: 100vh;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Scrollbar customization */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  ::-webkit-scrollbar-thumb {
    background: #00ffff;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #00cccc;
  }

  /* Form elements */
  input, textarea, select {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 8px;
    color: #ffffff;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #00ffff;
      box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  /* Buttons */
  button {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    font-family: inherit;
    font-weight: 500;
    transition: all 0.3s ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  /* Links */
  a {
    color: #00ffff;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #00cccc;
    }
  }

  /* Leaflet map customization */
  .leaflet-container {
    background: #1a1a1a;
    border-radius: 12px;
    overflow: hidden;
  }

  .leaflet-popup-content-wrapper {
    background: rgba(26, 26, 26, 0.95);
    color: #ffffff;
    border: 1px solid #00ffff;
    border-radius: 8px;
  }

  .leaflet-popup-tip {
    background: rgba(26, 26, 26, 0.95);
    border: 1px solid #00ffff;
  }

  /* Custom animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-slide-in {
    animation: slideInFromLeft 0.5s ease-out;
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }
`;

export default GlobalStyles;