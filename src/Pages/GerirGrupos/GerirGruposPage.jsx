import React from 'react'
import {useGetGrupos} from "../../Domain/useCases"
import Loading from "../../Components/Loading"
import {Button,   DialogTitle,Dialog,DialogActions,     DialogContent,DialogContentText,  Paper,MenuItem,Menu, Tooltip,Typography, IconButton, List, ListItem,Collapse, ListItemText, ListItemIcon} from "@material-ui/core"
import {Link} from "react-router-dom"
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Bar} from "react-chartjs-2"
import MembersComponent from "./MembersComponent"

const GerirGruposPage = () => {
    const [collapse, setCollapse]=React.useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedGroup, setSelectedGroup] = React.useState(null);
    const [datasets, setDatasets] = React.useState(null)
    const [deleteGrupo, setDeleteGrupo] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);

    const {
        data: grupos, 
        isFetching: fetchingGrupos,
        refetch: refetchGrupo
    } = useGetGrupos()

    const isLoading = React.useMemo(() => {
        return  fetchingGrupos
    }, [fetchingGrupos])
    console.log(grupos)
    React.useEffect(()=>{
        let tempAnualDatasets=[]
        if(!isLoading){
            grupos.data.forEach(g=>{
                 let orderedDataAnual= []
                for (let i = 1; i< 13; i++){
                    orderedDataAnual.push(Number(g.dist.anual[`m${i}`]))
                }
                tempAnualDatasets.push( {
                    label: g.name, 
                    data:  orderedDataAnual, 
                    backgroundColor: g.color,
                    fill: true,
                    borderColor: g.color
                })

            //     g.membros.forEach(m=>{
            //         const rc = RandomColor()
            //         let orderedDataMembers= []
            //         for (let j = 1; j< 13; j++){
            //             orderedDataMembers.push(Number(dist.data[g.abrv].members[m][`m${j}`]))
            //         }
            //         tempMembersDatasets[g.abrv].push({
            //             label: m, 
            //             data: orderedDataMembers, 
            //             backgroundColor: rc,
            //             fill: true,
            //             borderColor: rc
            //         })
            //    })
            })
          
            setDatasets(tempAnualDatasets)
        }
    }, [isLoading])
    
    if(isLoading) return <Loading msg="A carregar dados relacionados com os grupos de investigação..." />
    return (
        <div className="gerirGruposContainer">
            <Dialog onClose={()=>setOpenDelete(false)} aria-labelledby="simple-dialog-title" open={openDelete}>
            <DialogTitle id="alert-dialog-title">{"Tem a certeza que pretende apagar o pedido"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    O pedido será apagado permanentemente da base de dados. Tem a certeza que pretende continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!deleteGrupo && <Button style={{color: "#e74c3c"}}onClick={()=>{setDeleteGrupo(true)}}>
                        apagar
                    </Button>}
                    {deleteGrupo && <deleteGrupo
                        refetchGrupo={refetchGrupo}
                        id={selectedGroup} />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>

            </Dialog>
             <div className="titleContainer">
                <Typography variant="h6" color="primary" >Gestão de Grupos de Investigação</Typography>
                <Button component={Link} to="/novoGrupo" variant="contained" color="primary" >adicionar grupo</Button>
            </div>
            <Paper className="dataContainer">
                <div className="exportContainer">
                    <Tooltip title="Export data to excel">
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="graphContainer">
                    <Bar
                        width={100}
                        height={25}
                        data={{
                            labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], 
                            datasets: datasets
                        }}
                        options={{
                            tooltips:{
                                enabled: true
                            },
                            elements: {
                                point:{
                                    radius: 0
                                }
                            },
                            responsive: true, 
                            
                            chartArea: {
                                backgroundColor: 'rgba(251, 85, 85, 0.4)'
                            }, 
                            maintainAspectRatio: true,
                            legend:{
                                display: false, 
                                position: "top",
                                align:"center",
                                labels: {
                                    fontColor: "white",
                                }
                                
                            },
                        
                            scales:{
                                xAxes: [{
                                    display: true,
                                    gridLines: {
                                        display: true,
                                        color: "#ecf0f1"
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: `Ano de ${new Date().getFullYear()}`, 
                                        fontColor: "#666"
                                    },
                                    ticks:{
                                        fontColor: "#666"
                                    },
                                    // stacked: true,
                                }],
                                yAxes: [{
                                    display: true,
                                    gridLines: {
                                        display: true,
                                        color: "#ecf0f1"
                                    },
                                    
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Montante gasto (€)', 
                                        fontColor: "#666"
                                    },
                                    ticks:{
                                        fontColor: "#666"
                                    } 
                                }]
                            }
                        }}
                    />
                </div>
            </Paper>
            <List
                component={Paper}
                style={{paddingBottom: 0}}
            >
            {grupos.data.map(g=>{
                return(<>
                    <ListItem  key={g.id}>
                        <ListItemIcon>
                            <GroupWorkIcon style={{fontSize: 40,color: g.color}} />
                        </ListItemIcon>
                        <ListItemText primary={g.name} secondary={g.abrv} />
                        <IconButton onClick={(e)=>{
                            setSelectedGroup(g.id)
                            setAnchorEl(e.target)
                        }}>
                            <MoreVertIcon/>
                        </IconButton>
                        {/* {collapse===g.id ? <ExpandLess /> : <ExpandMore />} */}
                    </ListItem>
                    <Collapse key={"col_"+g.id} in={collapse===g.id} timeout="auto" unmountOnExit>
                        <MembersComponent setCollapse={setCollapse} id={g.id} />
                    </Collapse>
                </>)
                })
            }
            </List>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={()=>setAnchorEl(null)}
            >
                <MenuItem componente={Button} onClick={()=>{
                    setAnchorEl(null)
                    setCollapse(selectedGroup)    
                }}>DETALHES</MenuItem>
                <MenuItem componente={Link} to={`/editGrupo/${selectedGroup}`} onClick={()=>setAnchorEl(null)}>EDITAR</MenuItem>
                <MenuItem componente={Button} onClick={()=>{
                    setAnchorEl(null)
                    setOpenDelete(true)
                }}>ELIMINAR</MenuItem>
            </Menu>
        </div>
    )
}
export default GerirGruposPage