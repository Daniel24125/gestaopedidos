import React from 'react'
import {useGetGrupos, useGetDistAnual} from "../../Domain/useCases"
import Loading from "../../Components/Loading"
import {Button,   DialogTitle,Dialog,DialogActions, Snackbar, DialogContent,DialogContentText,  Paper,MenuItem,Menu, CircularProgress,Typography, IconButton, List, ListItem,Collapse, ListItemText, ListItemIcon} from "@material-ui/core"
import {Link} from "react-router-dom"
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Bar} from "react-chartjs-2"
import MembersComponent from "./MembersComponent"
import DeleteGroup from "./DeleteGrupoComponent"
import MuiAlert from '@material-ui/lab/Alert';
import DownloadDistCum from "./DownloadDistCum"
import DownloadDistGrupo from "./DownloadDisGrupo"

const GerirGruposPage = () => {
    const [collapse, setCollapse]=React.useState(null)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedGroup, setSelectedGroup] = React.useState(null);
    const [datasets, setDatasets] = React.useState(null)
    const [deleteGrupo, setDeleteGrupo] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteResult, setDeleteResult] = React.useState(null);
    const [selectedYear, setSelectedYear] = React.useState(2021);
    const [selectedDistID, setSelectedDistID] = React.useState(null);
    const [exportDistAnual, setExportDistAnual] = React.useState(null);
    const [exportDistAnualGrupo, setExportDistAnualGrupo] = React.useState(null);
    
    const {
        data: distAnual, 
        isFetching: fetchingDistAnual,
        refetch: refetchDist
    } = useGetDistAnual(selectedYear)


    const {
        data: grupos, 
        isFetching: fetchingGrupos,
        refetch
    } = useGetGrupos()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        } 
        refetch()
        refetchDist()
        setOpenDelete(false)
    };

    const isLoading = React.useMemo(() => {
        return  fetchingGrupos
        || fetchingDistAnual
    }, [fetchingGrupos, fetchingDistAnual])

    React.useEffect(()=>{
        let tempAnualDatasets=[]
        if(!isLoading){
            distAnual.data.forEach(d=>{
                 let orderedDataAnual= []
                 const grupoColor = grupos.data.filter(g=>g.abrv === d.grupo)[0].color
                for (let i = 1; i< 13; i++){
                    orderedDataAnual.push(Number(d.anual[`m${i}`]))
                }
                tempAnualDatasets.push( {
                    label: d.grupo, 
                    data:  orderedDataAnual, 
                    backgroundColor: grupoColor,
                    fill: true,
                    borderColor: grupoColor
                })
            })
            setDatasets(tempAnualDatasets)
        }
    }, [isLoading])
    
    if(isLoading) return <Loading msg="A carregar dados relacionados com os grupos de investigação..." />
    return (
        <div className="gerirGruposContainer">
            {grupos.data.length === 0 && <Paper style={{
            padding: "10px 20px",
            width: "100%",
            marginTop: 50
        }}>
            <Typography>Sem grupos para apresentar. <Button component={Link} to="/novoGrupo" color="primary">adicionar grupo</Button></Typography>    
        </Paper>}
            {grupos.data.length > 0 && <>
                <Dialog onClose={()=>{
                    setOpenDelete(false)
                    setDeleteResult(null)
                    setDeleteGrupo(false)
                    refetch()
                }} aria-labelledby="simple-dialog-title" open={openDelete}>
                <DialogTitle id="alert-dialog-title">{"Tem a certeza que pretende apagar o grupo selecionado"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        O grupo será apagado permanentemente da base de dados. Tem a certeza que pretende continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!deleteGrupo && <Button style={{color: "#e74c3c"}}onClick={()=>{setDeleteGrupo(true)}}>
                        apagar
                    </Button>}
                    {deleteGrupo && <DeleteGroup
                        id={selectedGroup} 
                        setDeleteGrupo={setDeleteGrupo}
                        setDeleteResult={setDeleteResult}
                        selectedDistID = {selectedDistID}
                        />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>
            </Dialog>
             <div className="titleContainer">
                <Typography variant="h6" color="primary" >Gestão de Grupos de Investigação</Typography>
                <div style={{
                    display: "flex"
                }}>
                    <Button style={{marginRight: 10}} component={Link} to="/novoGrupo" variant="contained" color="primary" >adicionar grupo</Button>
                    <Button onClick={()=>{
                        setExportDistAnual(true)
                    }} variant="contained" color="secondary" >
                        {exportDistAnual && <DownloadDistCum 
                            setExportDistAnual={setExportDistAnual}
                        /> }   
                        exportar dados
                        
                    </Button>
                </div>
            </div>
            {exportDistAnualGrupo && <DownloadDistGrupo 
                setExportDistAnualGrupo={setExportDistAnualGrupo}
                grupoID={selectedGroup}
            />}
            <Paper className="dataContainer">
               
                <div className="graphContainer">
                    <Bar
                        width={100}
                        height={25}
                        data={{
                            labels: ["Jan", "Fev", "Março", "Abril", "Maio", "Junho", "Julho", "Ag", "Set", "Out", "Nov", "Dez"], 
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
                           {exportDistAnualGrupo && selectedGroup === g.id && <CircularProgress  style={{marginRight: 10}} color="primary" />}
                           <GroupWorkIcon style={{fontSize: 40,color: g.color}} />

                        </ListItemIcon>
                        <ListItemText primary={g.name} secondary={g.abrv} />
                        <IconButton disabled={exportDistAnualGrupo} onClick={(e)=>{
                            setSelectedGroup(g.id)
                            setAnchorEl(e.target)
                            setSelectedDistID(g.dist)
                        }}>
                            <MoreVertIcon/>
                        </IconButton>
                    </ListItem>
                    <Collapse key={"col_"+g.id} in={collapse===g.id} timeout="auto" unmountOnExit>
                        <MembersComponent selectedYear={2021} setCollapse={setCollapse} id={g.id} />
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
                <MenuItem component={Button} onClick={()=>{
                    setAnchorEl(null)
                    setCollapse(selectedGroup)    
                }}>DETALHES</MenuItem>
                 <MenuItem component={Button} onClick={()=>{
                    setAnchorEl(null)
                    setExportDistAnualGrupo(true)
                }}>EXPORTAR</MenuItem>
                <MenuItem component={Link} to={`/editGrupo/${selectedGroup}`} onClick={()=>setAnchorEl(null)}>EDITAR</MenuItem>
                <MenuItem component={Button} onClick={()=>{
                    setAnchorEl(null)
                    setOpenDelete(true)
                }}>ELIMINAR</MenuItem>
            </Menu>
            {Boolean(deleteResult) && <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={deleteResult.error? "error": "success"}>
                    {deleteResult.error? deleteResult.msg: "O grupo foi eliminado com sucesso!"}
                </Alert>
            </Snackbar>}

            </>}
        </div>
    )
}
export default GerirGruposPage

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }