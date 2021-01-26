import React from 'react'
import {CircularProgress, IconButton, Snackbar } from "@material-ui/core"
import {useSearchPedidos} from "../../Domain/useCases"
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';

 const PerformSearch = ({
    word,
    field,
    setSubmitSearch,
    setPedidosList, 
    refetch
}) => {
    const {
        data: pedidos, 
        isFetching
    } = useSearchPedidos(word, field)
    const [open, setOpen] = React.useState(false);

    React.useEffect(()=>{
        if(!isFetching){
            if(pedidos.data.length > 0){
                setPedidosList(pedidos)
            }else{
                setOpen(true)
            }
        }
    }, [isFetching])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        } 
        setOpen(false);
        setSubmitSearch(false)
    };

    if(isFetching) return <CircularProgress size={40} />

    return (<>
        <IconButton onClick={()=>{
            refetch()
            setSubmitSearch(false)
        }}>
        <CloseIcon />
        </IconButton>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning">
            Não foi encontrado nenhum pedido com o termo pesquisado
            </Alert>
      </Snackbar>
    </>
    )
}
export default PerformSearch

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }