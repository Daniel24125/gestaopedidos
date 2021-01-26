import React from 'react'
import {useGetGrupos} from "../../Domain/useCases"
import Loading from "../../Components/Loading"
import {Button, Paper,Typography, List, ListItem,Collapse, ListItemText, ListItemIcon, ListItemSecondaryAction} from "@material-ui/core"
import {Link} from "react-router-dom"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const GerirGruposPage = () => {
    const [collapse, setCollapse]=React.useState(null)
    
    const {
        data: grupos, 
        isFetching: fetchingGrupos
    } = useGetGrupos()
    console.log(grupos)
    if(fetchingGrupos) return <Loading msg="A carregar todos os grupos registados..." />
    return (
        <div className="gerirGruposContainer">
             <div className="titleContainer">
                <Typography variant="h6" color="primary" >Gestão de Grupos</Typography>
                <Button component={Link} to="/novoGrupo" variant="contained" color="primary" >adicionar grupo</Button>
            </div>
            <List
                component={Paper}
            >
            {grupos.data.map(g=>{
                return(<>
                    <ListItem key={g.id} button onClick={()=>{
                        setCollapse(collapse===g.id? null: g.id)
                    }}>
                        <ListItemIcon>
                            <GroupWorkIcon style={{fontSize: 40,color: g.color}} />
                        </ListItemIcon>
                        <ListItemText primary={g.name} secondary={g.abrv} />
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                        {collapse===g.id ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse key={"col_"+g.id} in={collapse===g.id} timeout="auto" unmountOnExit>
                        <List style={{padding: "0 40px"}} component="div" >
                            {g.membros.map(m=>{
                                return (
                                    <ListItem key={m}>
                                        <ListItemIcon >
                                            <AccountCircleIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={m} />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Collapse>
                </>)
                })
            }
            </List>
        </div>
    )
}
export default GerirGruposPage