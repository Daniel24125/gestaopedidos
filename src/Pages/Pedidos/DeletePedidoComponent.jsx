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
        isFetching 
    } = useDeletePedido(id)

    React.useEffect(()=>{
        if(!isFetching){
            setOpenDelete(false)
            refetch()
            setDeletePedido(false)
        }
    }, [isFetching])
    
    if(isFetching) return (<CircularProgress />)
    return <></>
}
export default DeletePedidoComponent

