import React from 'react'
import {useDeleteGrupo} from "../../Domain/useCases"
import { CircularProgress} from "@material-ui/core"

 const DeletePedidoComponent = ({
    id,
    selectedDistID,
    setDeleteResult,
    setDeleteGrupo
 }) => {

    const {
        data: result, 
        isFetching 
    } = useDeleteGrupo(id, selectedDistID)

    React.useEffect(()=>{
        if(!isFetching){
            setDeleteResult(result)
            setDeleteGrupo(false)
        }
    }, [isFetching])

    if(isFetching) return (<CircularProgress />)
    return (<></>)
}
export default DeletePedidoComponent

