import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '@/components/App/index.js';
import '@/styles';

const root = createRoot(document.body.appendChild(document.createElement('div')));

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
