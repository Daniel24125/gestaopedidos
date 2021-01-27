import React from 'react'
import {useDeletePedido} from "../../Domain/useCases"
import {CircularProgress} from "@material-ui/core"

 const DeletePedidoComponent = ({ 
    id,
    setDeleteResult
 }) => {

    const {
        data: result, 
        isFetching 
    } = useDeletePedido(id)
    React.useEffect(()=>{
        if(!isFetching){
            setDeleteResult(result)
        }
    }, [isFetching])
    
    if(isFetching) return (<CircularProgress />)
    return <></>
}
export default DeletePedidoComponent

