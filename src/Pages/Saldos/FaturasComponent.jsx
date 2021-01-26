import React from 'react'
import {useGetFaturasByEmppresa} from "../../Domain/useCases"
import {CircularProgress, Button,Table, TableHead, TableRow, TableBody, TableCell, Typography, Tooltip, IconButton} from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
const FaturasComponent = ({empresa}) => {
    const {
        data: faturas, 
        isFetching
    } = useGetFaturasByEmppresa(empresa)

    console.log(faturas)
    return (
        <div className="optionsContainer">
            {isFetching && <CircularProgress size={60} style={{color: "white"}} />}
            {!isFetching && <Table size="medium">
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
                            <TableCell  >{f.codigo_fatura}</TableCell>
                            <TableCell >{f.data_emissao.slice(0,11)}</TableCell>
                            <TableCell >
                                <Button color="primary">ver pedido</Button>
                            </TableCell>
                            <TableCell >{f.valor}</TableCell>
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
        </div>
    )
}
export default FaturasComponent