import React from 'react'
import {useGetFaturasByPedido} from "../../Domain/useCases"
import {CircularProgress,
     IconButton,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteFatura from "../PedidosFormPage/DeleteFatura"

const GetFaturasPedido = ({
    pedidoID
}) => {

    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteFatura, setDeleteFatura] = React.useState(false);
    const [selectedFaturaID, setSelectedFaturaID] = React.useState(null);

    const {
        data: faturas, 
        isFetching: faturasFetching,
        refetch
    } = useGetFaturasByPedido(pedidoID)

    if(faturasFetching) return (<div style={{
        minWidth: 600,
        display: "flex", 
        justifyContent: "center",
        alignItems: "center"
    }}><CircularProgress /></div>)
    return (
       <>
            <Dialog onClose={()=>setOpenDelete(false)} aria-labelledby="simple-dialog-title" open={openDelete}>
            <DialogTitle id="alert-dialog-title">{"Tem a certeza que pretende apagar a fatura"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        A fatura será apagada permanentemente da base de dados. Tem a certeza que pretende continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {!deleteFatura && <Button style={{color: "#e74c3c"}}onClick={()=>{setDeleteFatura(true)}}>
                        apagar
                    </Button>}
                    {deleteFatura && <DeleteFatura
                        id={selectedFaturaID} 
                        setOpenDelete={setOpenDelete}
                        refetch={refetch}
                        setDeleteFatura={setDeleteFatura}
                        />}
                    <Button onClick={()=>setOpenDelete(false)} autoFocus>
                        cancelar
                    </Button>
                </DialogActions>

            </Dialog>
            {faturas.data.length > 0 &&<Table size="small">
                <TableHead>
                    <TableRow >
                        <TableCell align="right">Códido</TableCell>
                        <TableCell align="right">Data de Emissão</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell align="right">Notas</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {faturas.data.map((f,i)=>{
                        return (
                            <TableRow key={`fatura_${f.id}`}>
                                    <TableCell align="right">{f.name}</TableCell>
                                    <TableCell align="right">{f.data_emissao.substring(0,10)}</TableCell>
                                    <TableCell align="right">{f.valor_fatura} €</TableCell>
                                    <TableCell align="right">{f.notas}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={()=>{
                                            setOpenDelete(true)
                                            setSelectedFaturaID(f.id)   
                                        }} style={{color: "#e74c3c"}}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>}

            {faturas.data.length === 0&& <Typography style={{padding: "10px 20px"}}>Não foram emitidas faturas</Typography>}

        </>
    )
}
export default GetFaturasPedido