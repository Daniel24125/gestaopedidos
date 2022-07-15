import React from 'react'
import {CircularProgress} from "@material-ui/core"
import { useDeleteNES} from "../../Domain/useCases"

const DeleteNES = ({
    id,
    setOpenDelete,
    refetch,
    setDeleteNE
}) => {
    const {
        isFetching: deleteFetching,
    } = useDeleteNES(id)

    React.useEffect(()=>{
        if(!deleteFetching){
            setOpenDelete(false)
            refetch()
            setDeleteNE(false)
        }
    }, [deleteFetching])

    if(deleteFetching) return <CircularProgress color="primary" />
    return (
        <div>
            
        </div>
    )
}


export default DeleteNES