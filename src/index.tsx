import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { extendTheme, getInitColorSchemeScript } from '@mui/joy';

extendTheme({
  components: {
    JoySheet: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === 'glass' as any && {
            color: theme.vars.palette.text.primary,
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }),
        }),
      },
    },
  },
});

declare module '@mui/joy/Sheet' {
  interface SheetPropsVariantOverrides {
    glass: true;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {getInitColorSchemeScript()}
    <App />
  </React.StrictMode>
);
