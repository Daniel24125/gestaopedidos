import React from 'react'
import {useGetFornecedores} from "../../Domain/useCases"
import Loading from "../../Components/Loading"
import { Avatar,Collapse , Menu, MenuItem, Paper,Button,  IconButton,  Table, TableBody, TableCell, TableContainer,TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';
import RubricasComponent from "./RubricasComponent"
import FaturasComponent from "./FaturasComponent"
import {Link} from "react-router-dom"

const SaldosPage = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedElementID, setSelectedElementID] = React.useState(null);
    const [collapse, setCollapse] = React.useState(null);
    const [context, setContext] = React.useState(null);
    
    const {
        data: fornecedores, 
        isFetching
    } = useGetFornecedores()

    if(isFetching) return <Loading msg="A carregar dados de fornecedores..."/>

    return (
        <div className="fornecedoresContainer">
            <div className="titleContainer">
                <Typography color="primary" variant="h6">Fornecedores Registados</Typography>
                <Button component={Link} to="/empresas/registo" color="primary" variant="contained">adicionar fornecedor</Button>
            </div>
            <TableContainer style={{padding: "20px 0px 0 0"}} component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="left">Empresa</TableCell>
                            <TableCell align="left">NIF</TableCell>
                            <TableCell align="left">Morada</TableCell>
                            <TableCell align="left">CP</TableCell>
                            <TableCell align="left">Localidade</TableCell>
                            <TableCell align="left">Distrito</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fornecedores.data.map(f=>{
                            return( <>
                                <TableRow kew={f.id}>
                                    <TableCell style={{paddingLeft: 50}} align="right">
                                        <Avatar style={{backgroundColor: "#c0392b"}}>
                                            {f.empresa[0]}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell align="left">{f.empresa? f.empresa: "ND"}</TableCell>
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
                                    <TableCell style={{ padding: 0 }} colSpan={8}>
                                        <Collapse in={collapse===f.id} timeout="auto" unmountOnExit>
                                            <div className="collapseContainer">
                                                <div style={{ marginBottom: 10}} className="titleContainer">
                                                    <Typography>{context=== "rubricas"? "Saldos Disponíveis": "Faturação"}</Typography>
                                                    <IconButton  onClick={()=>setCollapse(null)}>
                                                        <CloseIcon/>
                                                    </IconButton>
                                                </div>
                                                {context=== "rubricas" && <RubricasComponent empresa={f.empresa} />}
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
                <MenuItem onClick={()=>setAnchorEl(null)}>ELIMINAR</MenuItem>
            </Menu>
        </div>
    )
}
export default  SaldosPage