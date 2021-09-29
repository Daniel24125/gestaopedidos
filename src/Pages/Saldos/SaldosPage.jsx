import React from 'react'
import {useGetFornecedores} from "../../Domain/useCases"
import Loading from "../../Components/Loading"
import { Avatar,Collapse ,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions, Menu, MenuItem, Paper,Button,  IconButton,  Table, TableBody, TableCell, TableContainer,TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';
import RubricasComponent from "./RubricasComponent"
import FaturasComponent from "./FaturasComponent"
import {Link} from "react-router-dom"
import DeleteEmpresa from "./DeleteEmpresa"
import GetAppIcon from '@material-ui/icons/GetApp';
import Export from './Export';

const SaldosPage = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedElementID, setSelectedElementID] = React.useState(null);
    const [collapse, setCollapse] = React.useState(null);
    const [context, setContext] = React.useState(null);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteEmpresa, setDeleteEmpresa] = React.useState(false);
    const [exportData, setExport] = React.useState(false);

    const {
        data: fornecedores, 
        isFetching: saldoFetching,
        refetch
    } = useGetFornecedores()

    if(saldoFetching) return <Loading msg="A carregar dados de fornecedores..."/>

    return (
        <div className="fornecedoresContainer">
            <Dialog onClose={()=>{
                setOpenDelete(false)
            }} aria-labelledby="simple-dialog-title" open={openDelete}>
                <DialogTitle id="alert-dialog-title">{"Tem a certeza que pretende apagar o fornecedor?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Os dados do fornecedor assim como as suas notas de encomenda serão apagados permanentemente da base de dados. Tem a certeza que pretende continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!deleteEmpresa && <Button style={{color: "#e74c3c"}}onClick={()=>{setDeleteEmpresa(true)}}>
                        apagar
                    </Button>}
                    {deleteEmpresa && <DeleteEmpresa
                        id={selectedElementID} 
                        setOpenDelete={setOpenDelete}
                        refetch={refetch}
                        setDeleteEmpresa={setDeleteEmpresa}
                        />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>

            </Dialog>
            <div className="titleContainer">
                <Typography color="primary" variant="h6">Fornecedores Registados</Typography>
                <div>

                <Button component={Link} to="/empresas/registo" color="primary" variant="contained">adicionar fornecedor</Button>
               {!exportData &&  <Tooltip title="Exportar">
                    <IconButton onClick={()=>setExport(true)}>
                        <GetAppIcon />
                    </IconButton>
                </Tooltip>}
                {exportData && <Export
                    setExport={setExport}
                />}
                </div>
            </div>
            <TableContainer style={{padding: "20px 0px 0 0"}} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="left">Empresa</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">NIF</TableCell>
                            <TableCell align="left">Morada</TableCell>
                            <TableCell align="left">CP</TableCell>
                            <TableCell align="left">Localidade</TableCell>
                            <TableCell align="left">Distrito</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fornecedores.data.sort((a,b)=> a.empresa < b.empresa? -1 : a.empresa > b.empresa? 1: 0).map(f=>{
                            return( <>
                                <TableRow kew={f.id}>
                                    <TableCell style={{paddingLeft: 50}} align="right">
                                        <Avatar style={{backgroundColor: "#c0392b"}}>
                                            {f.empresa[0]}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell align="left">{f.empresa? f.empresa: "ND"}</TableCell>
                                    <TableCell align="left">{f.email? f.email: "ND"}</TableCell>
                                    <TableCell align="left">{f.nif? f.nif: "ND"}</TableCell>
                                    <TableCell align="left">{f.morada? f.morada: "ND"}</TableCell>
                                    <TableCell align="left">{f.cp? f.cp: "ND"}</TableCell>
                                    <TableCell align="left">{f.localidade? f.localidade: "ND"}</TableCell>
                                    <TableCell align="left">{f.distrito? f.distrito: "ND"}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Opções">
                                            <IconButton onClick={(e)=>{
                                                setAnchorEl(e.target)
                                                setSelectedElementID(f.id)
                                            }}>
                                                <MoreVertIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ padding: 0 }} colSpan={9}>
                                        <Collapse in={collapse===f.id} timeout="auto" unmountOnExit>
                                            <div className="collapseContainer">
                                                <div style={{ marginBottom: 10}} className="titleContainer">
                                                    <Typography>{context=== "rubricas"? "Saldos Disponíveis": "Faturação"}</Typography>
                                                    <IconButton  onClick={()=>setCollapse(null)}>
                                                        <CloseIcon/>
                                                    </IconButton>
                                                </div>
                                                {context=== "rubricas" && <RubricasComponent empresa={f.id} />}
                                                {context=== "faturacao" && <FaturasComponent empresa={f.empresa} />}
                                            </div>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                                </>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Menu
                id="pedidos_menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={()=>setAnchorEl(null)}
            >
                <MenuItem onClick={()=>{
                    setCollapse(selectedElementID)
                    setContext("rubricas")
                    setAnchorEl(null)
                }}>RÚBRICAS</MenuItem>
                 <MenuItem onClick={()=>{
                    setCollapse(selectedElementID)
                    setContext("faturacao")
                    setAnchorEl(null)
                }}>FATURAÇÃO</MenuItem>
                <MenuItem component={Link} to={`/empresas/${selectedElementID}`} onClick={()=>{setAnchorEl(null)}}>EDITAR</MenuItem>
                <MenuItem onClick={()=>{
                    setAnchorEl(null)
                    setOpenDelete(true)
                }}>ELIMINAR</MenuItem>
            </Menu>
        </div>
    )
}
export default  SaldosPage