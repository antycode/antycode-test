import ReactDOM from 'react-dom/client';
import App from './app/App';
import { AppProvider } from './app/providers/AppProvider';
import { HashRouter } from 'react-router-dom';
import './shared/config/i18n/i18n';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppProvider>
      <App />
  </AppProvider>,
);

postMessage({ payload: 'removeLoading' }, '*');
