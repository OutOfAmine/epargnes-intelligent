import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { db, doc, setDoc } from './firebase';

const logErrorToFirebase = async (errorMsg: string, stack?: string) => {
  try {
    const errorId = Date.now().toString() + Math.random().toString(36).substring(2);
    await setDoc(doc(db, 'errors', errorId), {
      error: errorMsg,
      stack: stack || '',
      createdAt: Date.now()
    });
  } catch (e) {
    console.error('Failed to log error to Firebase:', e);
  }
};

window.addEventListener('error', (event) => {
  logErrorToFirebase(event.message, event.error?.stack);
});

window.addEventListener('unhandledrejection', (event) => {
  logErrorToFirebase(event.reason?.message || 'Unhandled Promise Rejection', event.reason?.stack);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
