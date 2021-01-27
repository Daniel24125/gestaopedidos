import React from 'react'
import {useDeleteGrupo} from "../../Domain/useCases"
import { CircularProgress} from "@material-ui/core"

 const DeletePedidoComponent = ({
    id,
    setDeleteResult
 }) => {

    const {
        data: result, 
        isFetching 
    } = useDeleteGrupo(id)

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

