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

const EmpresasComponent = () => {
    const {
        data: fornecedoresStats, 
        isFetching: fetchingFornecedoresStats
    } = useGetFornecedoresStats()

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
                {fornecedoresStats.num === 0 && <Typography>Neste momento não se encontra nenhuma empresa com o saldo a esgotar-se</Typography>}
                {fornecedoresStats.num > 0 && <div style={{
                    display: "flex", 
                    color: "#e74c3c", 
                    flexDirection: "column"
                }}>
                    <div style={{
                        display: "flex", 
                        color: "#e74c3c"
                    }}>
                        <ArrowDownwardIcon/>
                        <Typography variant="h6" >Fornecedores com saldo a esgotar ({fornecedoresStats.num})</Typography>
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
                                {fornecedoresStats.materiais.map(emp=>{
                                    return (
                                        <TableRow key={"Materiais_" + emp.empresa}>
                                            <TableCell component="th" scope="row">
                                                {emp.empresa}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Materiais" >
                                                    <WidgetsIcon style={{color: "#2980b9"}} />
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.materiais.cabimento.slice(-1)[0]}
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.materiais.comprimisso.slice(-1)[0]}

                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.materiais.ne.slice(-1)[0]}
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.materiais.saldo_disponivel.slice(-1)[0]}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                 {fornecedoresStats.reagentes.map(emp=>{
                                     return (
                                        <TableRow key={"Reagentes" + emp.empresa}>
                                            <TableCell component="th" scope="row">
                                                {emp.empresa}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Reagentes" >
                                                    <WhatshotIcon style={{color: "#e74c3c"}} />
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.reagentes.cabimento.slice(-1)[0]}
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.reagentes.comprimisso.slice(-1)[0]}

                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.reagentes.ne.slice(-1)[0]}
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.reagentes.saldo_disponivel.slice(-1)[0]}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                 {fornecedoresStats.seq.map(emp=>{
                                     return (
                                        <TableRow key={"Seq" + emp.empresa}>
                                            <TableCell component="th" scope="row">
                                                {emp.empresa}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Sequenciação" >
                                                    <GestureIcon style={{color: "#9b59b6"}} />
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.sequenciacao.cabimento.slice(-1)[0]}
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.sequenciacao.compromisso.slice(-1)[0]}

                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.sequenciacao.ne.slice(-1)[0]}
                                            </TableCell>
                                            <TableCell align="right">
                                                {emp.sequenciacao.saldo_disponivel.slice(-1)[0]} €
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