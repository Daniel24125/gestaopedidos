import React from 'react'
import {useDeletePedido} from "../../Domain/useCases"
import {CircularProgress} from "@material-ui/core"

 const DeletePedidoComponent = ({ 
    id,
    setOpenDelete,
    setDeletePedido,
    refetch
 }) => {
    const {
        data: result, 
        isFetching: deletePedidoFetching
    } = useDeletePedido(id)

    React.useEffect(()=>{
        if(!deletePedidoFetching){
            setOpenDelete(false)
            refetch()
            setDeletePedido(false)
        }
    }, [deletePedidoFetching])
    
    if(deletePedidoFetching) return (<CircularProgress />)
    return <></>
}
export default DeletePedidoComponent

