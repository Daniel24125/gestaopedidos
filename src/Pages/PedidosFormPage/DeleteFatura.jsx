import React from 'react'
import {CircularProgress} from "@material-ui/core"
import { useDeleteFatura} from "../../Domain/useCases"

const DeleteFatura = ({
    id,
    setDeleteResult,
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
            setDeleteResult(result)
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