import React from 'react'
import {useGetFaturasByEmppresa} from "../../Domain/useCases"
import {CircularProgress, Button,Table, TableHead, TableRow, TableBody, TableCell, Typography, Tooltip, IconButton} from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
const FaturasComponent = ({empresa}) => {
    const {
        data: faturas, 
        isFetching: getFaturasFetching
    } = useGetFaturasByEmppresa(empresa)
    
    return (
        <div className="optionsContainer">
            {getFaturasFetching && <CircularProgress size={60} color="primary"/>}
            {!getFaturasFetching && <>
                {faturas.data.length === 0 && <Typography style={{marginBottom: 20}}> Não existem faturas emitidas para esta empresa</Typography>}
                {faturas.data.length > 0 && <Table size="medium">
                    <TableHead> 
                        <TableRow>
                            <TableCell >Código da Fatura</TableCell>
                            <TableCell >Data de Emissão</TableCell>
                            <TableCell >Pedido</TableCell>
                            <TableCell >Valor</TableCell>
                            <TableCell >Notas</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {faturas.data.map(f => {
                            return (
                            <TableRow>
                                <TableCell  >{f.name}</TableCell>
                                <TableCell >{f.data_emissao.slice(0,11)}</TableCell>
                                <TableCell >
                                    {f.pedido}
                                </TableCell>
                                <TableCell >{f.valor_fatura}€</TableCell>
                                <TableCell>
                                    <Tooltip title="Ver notas">
                                        <IconButton color="primary">
                                            <CommentIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            <TableCell>
                                <Tooltip title="Apagar fatura">
                                    <IconButton style={{color: "#e74c3c"}}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                        )})}
                    </TableBody>
                </Table>}
            
            </>}
        </div>
    )
}
export default FaturasComponent