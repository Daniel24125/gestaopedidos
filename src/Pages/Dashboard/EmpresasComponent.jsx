import { Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tooltip 
} from '@material-ui/core'
import React from 'react'
import {useGetFornecedoresStats} from "../../Domain/useCases"
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Skeleton from '@material-ui/lab/Skeleton'
import WidgetsIcon from '@material-ui/icons/Widgets';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GestureIcon from '@material-ui/icons/Gesture';
import BuildIcon from '@material-ui/icons/Build';

const EmpresasComponent = () => {
    const {
        data: fornecedoresStats, 
        isFetching: fetchingFornecedoresStats
    } = useGetFornecedoresStats()
    
    const Rubricas = {
        "PM": ()=> <WidgetsIcon style={{color: "#3498db"}}/>,
        "PR":()=>  <WhatshotIcon style={{color: "#e74c3c"}}/>,
        "SEQ": ()=> <GestureIcon style={{color: "#9b59b6"}}/>, 
         "REP": ()=> <BuildIcon style={{color: "#f39c12"}}/>, 
    }

    return (
        <>
            {fetchingFornecedoresStats && <LoadingComponent/>}
            <Paper style={{
                width: "100%",
                display: "flex",
                flexDirection: "column", 
                marginTop: 50, 
                padding: 20
            }}>
            

            {!fetchingFornecedoresStats && <>
                {fornecedoresStats.nes.length === 0 && <Typography>Neste momento não se encontra nenhuma empresa com o saldo a esgotar-se</Typography>}
                {fornecedoresStats.nes.length  > 0 && <div style={{
                    display: "flex", 
                    color: "#e74c3c", 
                    flexDirection: "column"
                }}>
                    <div style={{
                        display: "flex", 
                        color: "#e74c3c"
                    }}>
                        <ArrowDownwardIcon/>
                        <Typography variant="h6" >Fornecedores com saldo a esgotar ({fornecedoresStats.nes.length})</Typography>
                    </div>
                    <TableContainer>
                        <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>Empresa</TableCell>
                                <TableCell align="right">Rubrica</TableCell>
                                <TableCell align="right">Cabimento</TableCell>
                                <TableCell align="right">Compromisso</TableCell>
                                <TableCell align="right">Nota de Encomenda</TableCell>
                                <TableCell align="right">Saldo Disponível</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {fornecedoresStats.nes.map(emp=>{
                                    return (
                                        <TableRow key={"Materiais_" + emp.empresa}>
                                            <TableCell component="th" scope="row">
                                                {emp.empresa}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title={emp.rubrica=== "PM"? "Materiais": emp.rubrica === "PR"? "Reagentes": "Sequenciação"} >
                                                   {Rubricas[emp.rubrica]()}
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.cabimento}
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.compromisso}

                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.ne}
                                            </TableCell>
                                            <TableCell align="right">
                                                {Number(emp.saldo_disponivel).toFixed(2)}€
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                
                                
                            </TableBody>
                        </Table>
                        </TableContainer>
                </div>}
            </>}
                
            </Paper>
        </>
    )
}
export default EmpresasComponent

const LoadingComponent = ()=>{
    return  <Skeleton variant="rect" width="100%" height={300} />
           
}
