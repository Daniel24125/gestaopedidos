import React from 'react'
import {CircularProgress} from "@material-ui/core"
import { useDeleteEmpresa} from "../../Domain/useCases"

const DeleteEmpresa = ({
    id,
    setOpenDelete,
    refetch,
    setDeleteEmpresa
}) => {
    const {
        data: result, 
        isFetching: deleteEmpresaFetching,
    } = useDeleteEmpresa(id)

    React.useEffect(()=>{
        if(!deleteEmpresaFetching){
            setOpenDelete(false)
            refetch()
            setDeleteEmpresa(false)
        }
    }, [deleteEmpresaFetching])

    if(deleteEmpresaFetching) return <CircularProgress color="primary" />
    return (
        <div>
            
        </div>
    )
}
export default DeleteEmpresa