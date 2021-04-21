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
        isFetching: deleteGrupoFetching
    } = useDeleteGrupo(id, selectedDistID)

    React.useEffect(()=>{
        if(!deleteGrupoFetching){
            setDeleteResult(result)
            setDeleteGrupo(false)
        }
    }, [deleteGrupoFetching])

    if(deleteGrupoFetching) return (<CircularProgress />)
    return (<></>)
}
export default DeletePedidoComponent

