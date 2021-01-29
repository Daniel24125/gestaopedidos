import React from 'react';
import './Styles/styles.sass';
import { useAuth0 } from "@auth0/auth0-react";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import {CssBaseline} from '@material-ui/core'
import loadable from '@loadable/component'

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '"Work Sans"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#21BCE9'
    },
    secondary: {
      main: '#434343'
    }
  },
  shape: {
    borderRadius: 4
  }
})


const LoginPage = loadable(() => import('./Pages/Login/Login'))
const Admin = loadable(() => import('./Pages/Admin/Admin'))
const Unauth = loadable(() => import('./Pages/Unauth/Unauth'))

const App = () => {
  const {user, isAuthenticated } = useAuth0();
  const [allowed, setAllowed] = React.useState(false)

  React.useEffect(()=>{
    if (isAuthenticated){
      const emails = process.env.REACT_APP_AUTH0_EMAIL.split(",")
      emails.forEach(email=>{
        if(user.email === email){
          setAllowed(true)
          return null
        }
      })
    }
  }, [isAuthenticated])
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
      {!isAuthenticated && <LoginPage/>}
      {isAuthenticated && allowed && <Admin/>}  
      {isAuthenticated && !allowed && <Unauth/>}  
    </ThemeProvider>
  );
}

export default App;
