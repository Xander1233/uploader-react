import React from 'react';
import './App.css';
import { Auth as AuthView } from './flows/auth/Auth';
import { Auth, AuthState } from './Shares/Auth';
import { Events } from './util/EventEmitter';
import { Menu } from './Menu/Menu';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { RouterProvider } from 'react-router-dom';
import { Router } from './routes/Routes';
import Footer from './Footer/Footer';

function App() {
  const [isAuth, setIsAuth] = React.useState<AuthState>(Auth.shared.isAuth);

  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    Auth.shared.subscribe(Events.ON_AUTH_STATE_CHANGE, (newState) => {
      setIsAuth(newState);

      if (newState) {
        Auth.shared.subscribeOnce(Events.PROFILE_FETCHED, (profile) => {
          setProfile(profile);
        });
      }
    });

    void Auth.shared.checkLogin();
  }, []);

  return (
    <CssVarsProvider defaultMode='dark'>
      <CssBaseline />
      <Menu />
      <RouterProvider router={Router} />
      <Footer />
    </CssVarsProvider>
  )
}

export default App;
