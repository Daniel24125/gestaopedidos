import React from 'react'
import {useDeletePedido} from "../../Domain/useCases"
import {Button, CircularProgress, Snackbar} from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';

 const DeletePedidoComponent = ({
    refetch, 
    id,

 }) => {

    const {
        data: result, 
        isFetching 
    } = useDeletePedido(id)


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        } 
        refetch()
    };

    if(isFetching) return (<CircularProgress />)
    return (
        <>
            <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={result.error? "error": "success"}>
                    {result.error? result.msg: "O pedido foi eliminado com sucesso!"}
                </Alert>
            </Snackbar>
        </>
    )
}
export default DeletePedidoComponent

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }