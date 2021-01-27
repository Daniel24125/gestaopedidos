import React from 'react'
import { Link, BrowserRouter} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import loadable from '@loadable/component'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import { Typography, Drawer,Divider, IconButton } from '@material-ui/core';
import {useAuth0} from "@auth0/auth0-react"
import {useSetAccessToken} from "../../Domain/useCases"
import { AnimatePresence } from 'framer-motion'
import SwitchComponent from "./SwitchComponent"
import AllInboxIcon from '@material-ui/icons/AllInbox';
import GroupIcon from '@material-ui/icons/Group';

const appBarHeight = 65
const Nav = loadable(() => import('.//Nav'))
const Footer = loadable(() => import('./Footer'))

const Admin = () => {
    const [hideMenu, setHideMenu] = React.useState(true) 
    const closeMenu = ()=> setHideMenu(true)
    const { getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = React.useState(null) 
    const switchComponent = <SwitchComponent />
    const history = React.useMemo(() => {
        return createBrowserHistory()
      }, [])
   
      React.useEffect(() => {
        return history.listen(()=>{
          window.scrollTo(0,0)
        })  
      }, [ history])

      React.useEffect(()=>{
        const setAccessTokenFun = async () => {        
            try {
                const access_token = await getAccessTokenSilently();
                setAccessToken(access_token)
            } catch (e) {
              console.log(e.message);
            }
          };
          setAccessTokenFun()
     }, [])
     
     useSetAccessToken(accessToken) 
     
    return (
        <BrowserRouter history={history}>
            <Drawer
                variant="temporary"
                anchor="left"
                open={!hideMenu}
                className="drawerContainer">
                    <div className="drawerHeader">
                        <Typography variant="h6">Gestão de Pedidos</Typography>
                        <IconButton onClick={closeMenu}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </div>
                    <Divider />
                    <div className="navListContainer">
                        <ul>
                            <li onClick={closeMenu}>
                                <Link to="/dashboard">
                                    <DashboardIcon/>
                                     Resumo
                                </Link>
                            </li>
                            <li onClick={closeMenu}>
                                <Link to="/pedidos">
                                    <LocalShippingIcon/>
                                      Pedidos de Encomendas
                                </Link>
                            </li>
                            <li onClick={closeMenu}>
                                <Link to="/gerirGrupos">
                                    <GroupIcon/>
                                      Grupos de Investigação
                                </Link>
                            </li>
                            <li onClick={closeMenu}>
                                <Link to="/empresas">
                                    <CreditCardIcon/>
                                      Saldo Empresarial
                                </Link>
                            </li>
                            <li onClick={closeMenu}>
                                <Link to="/artigos">
                                    <AllInboxIcon/>
                                      Gestão de Artigos
                                </Link>
                            </li>
                        </ul>
                    </div>
            </Drawer>
            <Nav hideMenu={hideMenu} setHideMenu={setHideMenu} height={appBarHeight}/>
            <main  style={{marginTop: appBarHeight}}>
              <AnimatePresence exitBeforeEnter={true} initial={false}>
                {switchComponent}
              </AnimatePresence>
            </main>
            <Footer />
        </BrowserRouter>
    )
}


export default Admin