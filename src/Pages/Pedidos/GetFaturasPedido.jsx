import React from 'react'
import {useGetFaturasByPedido} from "../../Domain/useCases"
import {CircularProgress,
     IconButton,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,} from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
const GetFaturasPedido = ({
    pedidoID
}) => {

    const {
        data: faturas, 
        isFetching
    } = useGetFaturasByPedido(pedidoID)

    console.log(faturas)
    if(isFetching) return <CircularProgress />
    return (
       <>
            {faturas.data.length > 0 &&<Table size="small">
                <TableHead>
                    <TableRow >
                        <TableCell align="right">Data de Emissão</TableCell>
                        <TableCell align="right">Códido</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell align="right">Notas</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {faturas.data.map((f,i)=>{
                        return (
                            <TableRow key={`fatura_${f.id}`}>
                                    <TableCell align="right">{f.data_emissao}</TableCell>
                                    <TableCell align="right">{f.name}</TableCell>
                                    <TableCell align="right">{f.valor_fatura} €</TableCell>
                                    <TableCell align="right">{f.notas}</TableCell>
                                    <TableCell align="center">
                                        <IconButton style={{color: "#e74c3c"}}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>}
            {faturas.data.length === 0 && <Typography style={{padding: "10px 20px"}}>Não foram emitidas faturas</Typography>}
        </>
    )
}
export default GetFaturasPedido