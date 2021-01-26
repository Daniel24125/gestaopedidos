import React from 'react'
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import {Avatar ,IconButton, Tooltip} from "@material-ui/core"
import CEBLogo from "../../Assets/logoceb.png" 
import { useAuth0 } from "@auth0/auth0-react";

const  Login = () => {
    const { loginWithRedirect } = useAuth0();


    return (
        <div style={{
            display: "flex",
            width: "100%", 
            height: "100vh", 
            alignContent: "center", 
            justifyContent: "center",
            background: "url('https://images.pexels.com/photos/1937687/pexels-photo-1937687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
            backgroundSize: "cover",
            position: "relative"
        }}>
            <div style={{
                display: "flex",
                width: "100%", 
                height: "100vh", 
                position: 'absolute',
                background: "linear-gradient(to right, #feac5e, #c779d0, #4bc0c8)",
                opacity: 0.5
            }}></div>
            <div style={{
                // width: "50%", 
                // height: "50%",
                display: "flex",
                alignItems: "center", 
                justifyContent: "center",
                flexDirection: "column",
                color: "white",
                zIndex: 10
            }}>
                
                <img style={{
                    width: 300,
                    marginBottom: 20
                     
                }}src={CEBLogo} alt=""/>
                {/* <Typography style={{marginBottom: 20}} variant="h1" >Bem-Vinda</Typography> */}
                <Tooltip title="Fazer login">
                    <Avatar component={IconButton} onClick={()=>loginWithRedirect()} style={{
                        backgroundColor: "#3498db",
                        width: 80,
                        height: 80
                    }}>
                        <VpnKeyIcon style={{
                            fontSize: 50
                        }}/>
                    </Avatar>
                </Tooltip>
            </div>

        </div>
    )
}
export default Login