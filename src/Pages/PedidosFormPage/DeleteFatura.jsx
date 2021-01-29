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
        isFetching,
    } = useDeleteFatura(id)

    React.useEffect(()=>{
        if(!isFetching){
            setOpenDelete(false)
            refetch()
            setDeleteFatura(false)
        }
    }, [isFetching])

    if(isFetching) return <CircularProgress color="primary" />
    return (
        <div>
            
        </div>
    )
}

export default DeleteFatura