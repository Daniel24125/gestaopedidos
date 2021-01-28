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
        isFetching,
    } = useDeleteEmpresa(id)

    React.useEffect(()=>{
        if(!isFetching){
            setOpenDelete(false)
            refetch()
            setDeleteEmpresa(false)
        }
    }, [isFetching])

    if(isFetching) return <CircularProgress color="primary" />
    return (
        <div>
            
        </div>
    )
}
export default DeleteEmpresa