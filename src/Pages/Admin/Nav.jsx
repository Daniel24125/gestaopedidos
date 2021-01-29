import React from 'react'
import {AppBar, Toolbar,Snackbar , Typography,Menu, MenuItem ,Button,  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, CircularProgress} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar} from "@material-ui/core"
import { Link } from 'react-router-dom'
import SaveConfigs from './SaveConfigs';
import {useGetConfigs} from "../../Domain/useCases"
import MuiAlert from '@material-ui/lab/Alert';


const Nav = (props) => {
    const { logout, user} = useAuth0();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showConfigs, setShowConfigs] = React.useState(false);
    const [saveConfigs, setSaveConfigs] = React.useState(null);
    const [tempConfig, setTempConfig] = React.useState({
        pedido_acabado: 0,
        saldo_th: 0,
    })

    const {
        data: configs, 
        isFetching,
    } = useGetConfigs()


    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
      };

    const handleChangeInputConfigs = (e) => {
        setTempConfig({
            ...tempConfig, 
            [e.target.id]: e.target.value
        })
      };
  
    React.useEffect(()=>{
        if(!isFetching){
            setTempConfig({
                pedido_acabado: configs.data.pedido_acabado/1000/60/60/24,
                saldo_th: configs.data.saldo_th,
            })
        }
    },[isFetching])

    return (
        <>
            <Dialog open={showConfigs} onClose={()=>{
                setShowConfigs(false)
            }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Preferências</DialogTitle>
                {isFetching && <CircularProgress />}
                {!isFetching && <>
                    <DialogContent>
                        
                        <DialogContentText>
                            Preencha o formulário se quiser alterar as configurações
                        </DialogContentText>
                        <TextField
                            margin="normal"
                            id="pedido_acabado"
                            label="Pedido Atrasado"
                            fullWidth
                            type="number"
                            value={tempConfig.pedido_acabado}
                            onChange={handleChangeInputConfigs}
                            helperText="Coloque o nº de dias para que um pedido seja considerado atrasado, após ter sido feito"
                        />
                        <TextField
                            margin="normal"
                            id="saldo_th"
                            label="Limiar de Saldo Baixo"
                            fullWidth
                            value={tempConfig.saldo_th}
                            onChange={handleChangeInputConfigs}
                            helperText="Coloque o valor monetário a ser considerado para que um empresa seja considerada com baixo saldo disponível"

                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{
                            setShowConfigs(false)
                        }}>
                            Cancel
                        </Button>
                        {!saveConfigs && <Button 
                        disabled={tempConfig.pedido_acabado=== 0 || tempConfig.saldo_th === 0}
                        onClick={()=>{
                            setSaveConfigs(true)
                        }} color="primary">
                            guardar
                        </Button>}
                        {saveConfigs && <SaveConfigs 
                             configs={{
                                 ...tempConfig,
                                 pedido_acabado: tempConfig.pedido_acabado *24*60*60*1000
                             }} 
                             setSaveConfigs={setSaveConfigs}
                             setOpenSnackbar={setOpenSnackbar}
                        />}
                    </DialogActions>
                </>}
                
            </Dialog>
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
                    <Button component={Link} to="/pedidos/registo">registar pedido</Button>
                    <Avatar style={{marginLeft: 20}}onClick={handleClick} alt="avatar" src={user.picture} />
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        className="navMenuContainer"
                    >
                        <MenuItem component={Link} to="/settings" onClick={()=>{
                            setShowConfigs(true)
                            handleClose()
                        }}>Configurações</MenuItem>
                        <MenuItem onClick={()=>logout()}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    As configurações foram guardadas com sucesso!
                </Alert>
            </Snackbar>
        </AppBar>
    </>
    )
}

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
export default Nav