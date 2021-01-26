import React from 'react'
import {AppBar, Toolbar, Typography,Menu, MenuItem ,Button} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar} from "@material-ui/core"
import { Link } from 'react-router-dom'

const Nav = (props) => {
    const { logout, user} = useAuth0();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
        <AppBar className={props.hideMenu? "navContainer": "navContainer openMenuNav"} color="inherit" height={props.height} position="fixed">
        <Toolbar className="contentContainer">
            <div className="iconContainer">
                <IconButton onClick={()=>props.setHideMenu(false)} className={!props.hideMenu? "hide": ""}>
                    <MenuIcon  className="openMenu" />
                </IconButton>   
                <Typography className={!props.hideMenu? "titleText hide": "titleText"}> 
                    <Link to="/">
                        Gestão de Pedidos
                    </Link>
                </Typography>
            </div>
            <div className="navAccountContainer">
                <Avatar style={{marginLeft: 20}}onClick={handleClick} alt="avatar" src={user.picture} />
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    className="navMenuContainer"
                >
                    <MenuItem component={Link} to="/settings" onClick={handleClose}>Configurações</MenuItem>
                    <MenuItem onClick={()=>logout()}>Logout</MenuItem>
                </Menu>
            </div>
        </Toolbar>
    </AppBar>
    )
}

export default Nav
