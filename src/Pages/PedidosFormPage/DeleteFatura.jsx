import React from 'react'
import {CircularProgress} from "@material-ui/core"
import { useDeleteFatura} from "../../Domain/useCases"

const DeleteFatura = ({
    id,
    setOpenDelete,
    refetch,
    setDeleteFatura
}) => {
    const {
        data: result, 
        isFetching: deleteFaturaFetching,
    } = useDeleteFatura(id)

    React.useEffect(()=>{
        if(!deleteFaturaFetching){
            setOpenDelete(false)
            refetch()
            setDeleteFatura(false)
        }
    }, [deleteFaturaFetching])

    if(deleteFaturaFetching) return <CircularProgress color="primary" />
    return (
        <div>
            
        </div>
    )
}

export default DeleteFatura